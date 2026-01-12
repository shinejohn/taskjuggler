/**
 * @taskjuggler/ui - Shared Component Library
 * 
 * This package exports all shadcn-vue components for use across all Vue projects.
 */

// Utility functions
export { cn } from './lib/utils';

// UI Components
export { Button, buttonVariants, type ButtonVariants } from './components/ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
export { Input } from './components/ui/input';
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogScrollContent, DialogTitle, DialogTrigger } from './components/ui/dialog';
export { Badge, badgeVariants, type BadgeVariants } from './components/ui/badge';
export { Avatar, AvatarFallback, AvatarImage, avatarVariant, type AvatarVariants } from './components/ui/avatar';
export { Separator } from './components/ui/separator';
export { Label } from './components/ui/label';
export { Select, SelectContent, SelectGroup, SelectItem, SelectItemText, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from './components/ui/select';
export { Checkbox } from './components/ui/checkbox';
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
export { Switch } from './components/ui/switch';
export { Textarea } from './components/ui/textarea';
export { Slider } from './components/ui/slider';
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion';
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './components/ui/dropdown-menu';
export { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
export { Table, TableBody, TableCaption, TableCell, TableEmpty, TableFooter, TableHead, TableHeader, TableRow } from './components/ui/table';
export { Skeleton } from './components/ui/skeleton';
export { Progress } from './components/ui/progress';
export { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
export { Toaster as Sonner } from './components/ui/sonner';
export { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from './components/ui/form';
export { useFormField } from './components/ui/form/useFormField';
