
import { supabase } from '../lib/supabase';
import { Assignment, Note, CourseDocument, ClassSubject, ChatMessage } from '../types';

export const db = {
  // --- Assignments ---
  async addAssignment(courseId: string, assignment: Omit<Assignment, 'id'>) {
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        course_id: courseId,
        title: assignment.title,
        due_date: assignment.dueDate,
        completed: assignment.completed,
        grade: assignment.grade
      })
      .select()
      .single();
    
    if (error) throw error;
    return { ...assignment, id: data.id };
  },

  async updateAssignment(assignment: Assignment) {
    const { error } = await supabase
      .from('assignments')
      .update({
        title: assignment.title,
        due_date: assignment.dueDate,
        completed: assignment.completed,
        grade: assignment.grade
      })
      .eq('id', assignment.id);
    
    if (error) throw error;
  },

  async deleteAssignment(id: string) {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Notes ---
  async addNote(courseId: string, note: Omit<Note, 'id'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        course_id: courseId,
        title: note.title,
        content: note.content,
        created_at: note.createdAt // Ensure this matches DB column if passed, otherwise let DB default
      })
      .select()
      .single();

    if (error) throw error;
    return { ...note, id: data.id, createdAt: data.created_at };
  },

  async updateNote(note: Note) {
    const { error } = await supabase
      .from('notes')
      .update({
        title: note.title,
        content: note.content
      })
      .eq('id', note.id);

    if (error) throw error;
  },

  async deleteNote(id: string) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Documents ---
  async addDocument(courseId: string, doc: Omit<CourseDocument, 'id'>) {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        course_id: courseId,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        upload_date: doc.uploadDate
      })
      .select()
      .single();

    if (error) throw error;
    return { ...doc, id: data.id };
  },

  async deleteDocument(id: string) {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Chat Messages ---
  async getChatHistory(courseId: string): Promise<ChatMessage[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return (data || []).map(msg => ({
      role: msg.role as 'user' | 'model',
      text: msg.content,
      timestamp: new Date(msg.timestamp)
    }));
  },

  async saveChatMessage(courseId: string, message: ChatMessage) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        course_id: courseId,
        user_id: user.id,
        role: message.role,
        content: message.text,
        timestamp: message.timestamp.toISOString()
      });

    if (error) throw error;
  },

  async clearChatHistory(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('course_id', courseId)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async deleteCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)
      .eq('user_id', user.id);

    if (error) throw error;
  }
};
