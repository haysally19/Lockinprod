@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Plus, BookOpen, Calendar, FileText, MessageSquare } from 'lucide-react';
 import { supabase } from '../lib/supabase';
 import { CourseCard } from '../components/CourseCard';
 import { CreateCourseModal } from '../components/CreateCourseModal';
+import { useNavigate } from 'react-router-dom';
 
 interface Course {
   id: string;
@@ .. @@
 export function Dashboard() {
   const [courses, setCourses] = useState<Course[]>([]);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [loading, setLoading] = useState(true);
+  const [user, setUser] = useState<any>(null);
+  const navigate = useNavigate();
 
   useEffect(() => {
+    // Check authentication
+    const checkAuth = async () => {
+      const { data: { session } } = await supabase.auth.getSession();
+      if (!session) {
+        navigate('/login');
+        return;
+      }
+      setUser(session.user);
+    };
+
+    checkAuth();
+
+    // Listen for auth changes
+    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
+      if (event === 'SIGNED_OUT' || !session) {
+        navigate('/login');
+      } else {
+        setUser(session.user);
+      }
+    });
+
+    return () => subscription.unsubscribe();
+  }, [navigate]);
+
+  useEffect(() => {
+    if (!user) return;
+
     fetchCourses();
-  }, []);
+  }, [user]);
 
   const fetchCourses = async () => {
     try {
       const { data, error } = await supabase
         .from('courses')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       setCourses(data || []);
     } catch (error) {
       console.error('Error fetching courses:', error);
     } finally {
       setLoading(false);
     }
   };
 
@@ .. @@
     setIsCreateModalOpen(false);
   };
 
+  if (!user) {
+    return null; // Will redirect to login
+  }
+
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
@@ .. @@
   return (
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="mb-8">
-        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
+        <h1 className="text-3xl font-bold text-gray-900">
+          Welcome back, {user.user_metadata?.full_name || user.email}
+        </h1>
         <p className="mt-2 text-gray-600">
           Manage your courses and track your learning progress
         </p>
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <div className="flex items-center">
             <BookOpen className="h-8 w-8 text-indigo-600" />
             <div className="ml-4">
               <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
               <p className="text-gray-600">Total Courses</p>
             </div>
           </div>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <div className="flex items-center">
             <Calendar className="h-8 w-8 text-green-600" />
             <div className="ml-4">
               <p className="text-2xl font-semibold text-gray-900">
                 {courses.reduce((acc, course) => acc + (course.assignments?.length || 0), 0)}
               </p>
               <p className="text-gray-600">Assignments</p>
             </div>
           </div>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <div className="flex items-center">
             <FileText className="h-8 w-8 text-blue-600" />
             <div className="ml-4">
               <p className="text-2xl font-semibold text-gray-900">
                 {courses.reduce((acc, course) => acc + (course.notes?.length || 0), 0)}
               </p>
               <p className="text-gray-600">Notes</p>
             </div>
           </div>
         </div>
         
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
           <div className="flex items-center">
             <MessageSquare className="h-8 w-8 text-purple-600" />
             <div className="ml-4">
               <p className="text-2xl font-semibold text-gray-900">
                 {courses.reduce((acc, course) => acc + (course.documents?.length || 0), 0)}
               </p>
               <p className="text-gray-600">Documents</p>
             </div>
           </div>
         </div>
       </div>
 
       <div className="flex justify-between items-center mb-6">
-        <h2 className="text-xl font-semibold text-gray-900">Recent Courses</h2>
+        <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
         <button
           onClick={() => setIsCreateModalOpen(true)}
           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
         >
           <Plus className="h-4 w-4 mr-2" />
           Add Course
         </button>
       </div>
 
       {courses.length === 0 ? (
         <div className="text-center py-12">
           <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
           <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
           <p className="mt-1 text-sm text-gray-500">Get started by creating your first course.</p>
           <div className="mt-6">
             <button
               onClick={() => setIsCreateModalOpen(true)}
               className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
             >
               Create Course
             </button>
           </div>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {courses.map((course) => (
             <CourseCard key={course.id} course={course} />
           ))}
         </div>
       )}
 
       <CreateCourseModal
         isOpen={isCreateModalOpen}
         onClose={() => setIsCreateModalOpen(false)}
         onCourseCreated={handleCourseCreated}
       />
     </div>
   );
 }