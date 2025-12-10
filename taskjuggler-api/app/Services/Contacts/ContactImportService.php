<?php

namespace App\Services\Contacts;

use Illuminate\Support\Facades\Log;

class ContactImportService
{
    /**
     * Parse vCard file content
     * Supports vCard 2.1 and 3.0 formats
     */
    public function parseVCard(string $content): array
    {
        $contacts = [];
        $currentContact = [];
        $lines = explode("\n", $content);
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip empty lines
            if (empty($line)) {
                continue;
            }
            
            // Handle line continuation (lines starting with space or tab)
            if (preg_match('/^[\s\t]/', $line)) {
                if (!empty($currentContact) && isset($currentContact['last_key'])) {
                    $currentContact[$currentContact['last_key']] .= substr($line, 1);
                }
                continue;
            }
            
            // Start of new contact
            if (strtoupper($line) === 'BEGIN:VCARD') {
                $currentContact = [];
                continue;
            }
            
            // End of contact - save it
            if (strtoupper($line) === 'END:VCARD') {
                if (!empty($currentContact)) {
                    $contacts[] = $this->normalizeVCardContact($currentContact);
                }
                $currentContact = [];
                continue;
            }
            
            // Parse vCard property (KEY:VALUE or KEY;PARAMS:VALUE)
            if (preg_match('/^([^:]+):(.+)$/', $line, $matches)) {
                $key = strtoupper(trim($matches[1]));
                $value = trim($matches[2]);
                
                // Handle parameters (e.g., FN;CHARSET=UTF-8:John Doe)
                $keyParts = explode(';', $key);
                $baseKey = $keyParts[0];
                
                // Decode quoted-printable encoding
                $value = $this->decodeQuotedPrintable($value);
                
                // Map vCard properties to our format
                switch ($baseKey) {
                    case 'FN':
                        $currentContact['name'] = $value;
                        break;
                    case 'N':
                        // N format: Family;Given;Additional;Prefix;Suffix
                        $nameParts = explode(';', $value);
                        if (empty($currentContact['name'])) {
                            $name = trim(implode(' ', array_filter([
                                $nameParts[3] ?? '', // Prefix
                                $nameParts[1] ?? '', // Given
                                $nameParts[2] ?? '', // Additional
                                $nameParts[0] ?? '', // Family
                                $nameParts[4] ?? '', // Suffix
                            ])));
                            if (!empty($name)) {
                                $currentContact['name'] = $name;
                            }
                        }
                        break;
                    case 'EMAIL':
                        if (empty($currentContact['email'])) {
                            $currentContact['email'] = strtolower($value);
                        }
                        break;
                    case 'TEL':
                    case 'PHONE':
                        if (empty($currentContact['phone'])) {
                            $currentContact['phone'] = $this->normalizePhone($value);
                        }
                        break;
                }
                
                $currentContact['last_key'] = $baseKey;
            }
        }
        
        // Handle last contact if file doesn't end with END:VCARD
        if (!empty($currentContact)) {
            $contacts[] = $this->normalizeVCardContact($currentContact);
        }
        
        return $contacts;
    }

    /**
     * Parse CSV file content (Outlook format)
     */
    public function parseCSV(string $content): array
    {
        $contacts = [];
        $lines = str_getcsv($content, "\n");
        
        if (empty($lines)) {
            return $contacts;
        }
        
        // First line is usually headers
        $headers = str_getcsv(array_shift($lines));
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);
        
        // Map common CSV column names
        $nameIndex = $this->findColumnIndex($headers, ['name', 'full name', 'display name', 'first name', 'last name']);
        $emailIndex = $this->findColumnIndex($headers, ['email', 'e-mail', 'email address']);
        $phoneIndex = $this->findColumnIndex($headers, ['phone', 'telephone', 'mobile', 'phone number']);
        $firstNameIndex = $this->findColumnIndex($headers, ['first name', 'firstname', 'given name']);
        $lastNameIndex = $this->findColumnIndex($headers, ['last name', 'lastname', 'surname', 'family name']);
        
        foreach ($lines as $line) {
            $row = str_getcsv($line);
            if (empty($row)) {
                continue;
            }
            
            $contact = [];
            
            // Get name
            if ($nameIndex !== null && isset($row[$nameIndex])) {
                $contact['name'] = trim($row[$nameIndex]);
            } elseif ($firstNameIndex !== null || $lastNameIndex !== null) {
                $firstName = ($firstNameIndex !== null && isset($row[$firstNameIndex])) ? trim($row[$firstNameIndex]) : '';
                $lastName = ($lastNameIndex !== null && isset($row[$lastNameIndex])) ? trim($row[$lastNameIndex]) : '';
                $contact['name'] = trim($firstName . ' ' . $lastName);
            }
            
            // Get email
            if ($emailIndex !== null && isset($row[$emailIndex])) {
                $email = trim($row[$emailIndex]);
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $contact['email'] = strtolower($email);
                }
            }
            
            // Get phone
            if ($phoneIndex !== null && isset($row[$phoneIndex])) {
                $phone = trim($row[$phoneIndex]);
                if (!empty($phone)) {
                    $contact['phone'] = $this->normalizePhone($phone);
                }
            }
            
            // Only add contact if it has at least a name
            if (!empty($contact['name'])) {
                $contacts[] = $contact;
            }
        }
        
        return $contacts;
    }

    /**
     * Detect file format and parse accordingly
     */
    public function parseFile(string $content, string $filename): array
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        switch ($extension) {
            case 'vcf':
                return $this->parseVCard($content);
            case 'csv':
                return $this->parseCSV($content);
            default:
                // Try to detect format by content
                if (stripos($content, 'BEGIN:VCARD') !== false) {
                    return $this->parseVCard($content);
                } elseif (stripos($content, ',') !== false || stripos($content, ';') !== false) {
                    return $this->parseCSV($content);
                }
                
                throw new \InvalidArgumentException("Unsupported file format. Please upload a .vcf or .csv file.");
        }
    }

    /**
     * Normalize vCard contact data
     */
    private function normalizeVCardContact(array $contact): array
    {
        $normalized = [
            'name' => $contact['name'] ?? '',
            'email' => $contact['email'] ?? null,
            'phone' => $contact['phone'] ?? null,
        ];
        
        // Remove empty values
        return array_filter($normalized, fn($value) => $value !== null && $value !== '');
    }

    /**
     * Decode quoted-printable encoding
     */
    private function decodeQuotedPrintable(string $value): string
    {
        // Decode =XX hex codes
        $value = preg_replace_callback('/=([0-9A-F]{2})/i', function ($matches) {
            return chr(hexdec($matches[1]));
        }, $value);
        
        // Decode = at end of line (soft line break)
        $value = str_replace("=\n", '', $value);
        $value = str_replace("=\r\n", '', $value);
        
        return $value;
    }

    /**
     * Normalize phone number format
     */
    private function normalizePhone(string $phone): string
    {
        // Remove all non-digit characters except +
        $phone = preg_replace('/[^\d+]/', '', $phone);
        
        // If no + and starts with 0, assume it's a local number
        // If no + and starts with 1-9, assume it's a local number
        // Otherwise, keep as is
        
        return $phone;
    }

    /**
     * Find column index by trying multiple possible names
     */
    private function findColumnIndex(array $headers, array $possibleNames): ?int
    {
        foreach ($possibleNames as $name) {
            $index = array_search($name, $headers);
            if ($index !== false) {
                return $index;
            }
        }
        return null;
    }
}
