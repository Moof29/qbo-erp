
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PenLine } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CustomerNote {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
}

interface NotesTabProps {
  notes: CustomerNote[];
}

const NotesTab: React.FC<NotesTabProps> = ({ notes: initialNotes }) => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(initialNotes);
  const { toast } = useToast();

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      // In a real app, you would insert into a notes table
      // This is just mock functionality since we don't have a notes table yet
      toast({
        title: "Note added",
        description: "Customer note has been saved",
      });
      return { 
        id: Date.now().toString(), 
        content, 
        created_at: new Date().toISOString(), 
        created_by: 'Current User' 
      };
    },
    onSuccess: (newNote) => {
      setNotes([newNote, ...notes]);
      setNewNote('');
    },
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote.trim());
    }
  };
  
  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{note.created_by}</span>
            <span className="text-sm text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm">{note.content}</p>
        </div>
      ))}
      
      <div className="mt-6">
        <Textarea 
          placeholder="Add a note about this customer..." 
          className="mb-2" 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <Button 
          size="sm" 
          onClick={handleAddNote}
          disabled={!newNote.trim() || addNoteMutation.isPending}
        >
          <PenLine className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>
    </div>
  );
};

export default NotesTab;
