import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';

interface NoteItem {
  text: string;
  timestamp?: string;
}

interface NoteCategory {
  category: string;
  items: NoteItem[];
}

interface NotesPanelProps {
  notes: NoteCategory[];
  onAddNote?: (category: string, text: string) => void;
  onAddCategory?: (categoryName: string) => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ notes, onAddNote, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newItemText, setNewItemText] = useState<{ [key: string]: string }>({});

  const handleAddCategory = () => {
    if (newCategory.trim() && onAddCategory) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleAddItem = (category: string) => {
    const text = newItemText[category]?.trim();
    if (text && onAddNote) {
      onAddNote(category, text);
      setNewItemText({ ...newItemText, [category]: '' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary flex justify-between items-center">
        <span>Meeting Notes</span>
        {onAddCategory && (
          <button 
            onClick={() => setIsAddingCategory(true)} 
            className="text-primary hover:text-primary-hover text-label font-medium flex items-center transition-colors duration-fast"
            aria-label="Add category"
          >
            <PlusIcon size={16} className="mr-1" /> Add Category
          </button>
        )}
      </div>
      
      {isAddingCategory && (
        <div className="p-3 bg-primary-light border-b border-border flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 border border-border rounded-md px-3 py-2 text-body-medium bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            placeholder="New category name" 
            value={newCategory} 
            onChange={e => setNewCategory(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
          />
          <button 
            className="bg-primary text-white px-3 py-2 rounded-md text-label font-medium min-h-[44px] hover:bg-primary-hover transition-colors duration-fast" 
            onClick={handleAddCategory}
            aria-label="Add category"
          >
            Add
          </button>
          <button 
            className="text-text-secondary hover:text-text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" 
            onClick={() => {
              setIsAddingCategory(false);
              setNewCategory('');
            }}
            aria-label="Cancel"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <p className="text-body-medium">No notes yet. Add a category to get started.</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="glass-standard rounded-lg overflow-hidden shadow-1">
              <div className="bg-bg-secondary p-3 font-medium text-title-medium text-text-primary border-b border-border">
                {note.category}
              </div>
              <ul className="p-3 space-y-2">
                {note.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                    <span className="text-body-medium text-text-primary">{item.text}</span>
                  </li>
                ))}
                {onAddNote && (
                  <li className="pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 border border-border rounded-md px-3 py-2 text-body-medium bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        placeholder="Add item..."
                        value={newItemText[note.category] || ''}
                        onChange={e => setNewItemText({ ...newItemText, [note.category]: e.target.value })}
                        onKeyPress={e => e.key === 'Enter' && handleAddItem(note.category)}
                      />
                      <button 
                        className="text-primary hover:text-primary-hover text-label font-medium flex items-center transition-colors duration-fast"
                        onClick={() => handleAddItem(note.category)}
                        aria-label="Add item"
                      >
                        <PlusIcon size={16} className="mr-1" /> Add
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
