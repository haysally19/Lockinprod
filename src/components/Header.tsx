@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
-import { BookOpen, Menu, X, User, LogOut, Settings } from 'lucide-react';
+import { BookOpen, Menu, X, User, LogOut, Settings, Crown } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
+import { supabase } from '../lib/supabase';
 
 export function Header() {
   const { user, signOut } = useAuth();
   const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isProfileOpen, setIsProfileOpen] = useState(false);
+  const [userTier, setUserTier] = useState<string>('free');
+
+  useEffect(() => {
+    const fetchUserTier = async () => {
+      if (!user) return;
+
+      try {
+        const { data: profile } = await supabase
+          .from('profiles')
+          .select('tier')
+          .eq('id', user.id)
+          .single();
+
+        if (profile) {
+          setUserTier(profile.tier || 'free');
+        }
+      } catch (error) {
+        console.error('Error fetching user tier:', error);
+      }
+    };
+
+    fetchUserTier();
+  }, [user]);
 
   const handleSignOut = async () => {
@@ .. @@
             <div className="flex items-center space-x-4">
               <Link
                 to="/pricing"
-                className="text-gray-600 hover:text-indigo-600 transition-colors"
+                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
               >
+                {userTier === 'pro' && <Crown className="w-4 h-4 text-yellow-500 mr-1" />}
                 Pricing
               </Link>
               <div className="relative">
@@ .. @@
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
                       <div className="font-medium">{user.email}</div>
+                      <div className="text-xs text-gray-500 flex items-center mt-1">
+                        {userTier === 'pro' && <Crown className="w-3 h-3 text-yellow-500 mr-1" />}
+                        {userTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
+                      </div>
                     </div>
                     <Link
                       to="/profile"
@@ .. @@
                     <Link
                       to="/pricing"
-                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
+                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                       onClick={() => setIsMenuOpen(false)}
                     >
+                      {userTier === 'pro' && <Crown className="w-4 h-4 text-yellow-500 mr-2" />}
                       Pricing
                     </Link>
                     <div className="border-t border-gray-200 pt-4 pb-3">
                       <div className="px-4">
                         <div className="text-base font-medium text-gray-800">{user.email}</div>
+                        <div className="text-sm text-gray-500 flex items-center mt-1">
+                          {userTier === 'pro' && <Crown className="w-3 h-3 text-yellow-500 mr-1" />}
+                          {userTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
+                        </div>
                       </div>
                       <div className="mt-3 space-y-1">
                         <Link