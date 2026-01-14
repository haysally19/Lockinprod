@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
-import { BookOpen, Menu, X, User, LogOut } from 'lucide-react';
+import { BookOpen, Menu, X, User, LogOut, Crown } from 'lucide-react';
 import { supabase } from '../../lib/supabase';
+import { getUserSubscription } from '../../lib/stripe';
 
 export function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [user, setUser] = useState<any>(null);
+  const [subscription, setSubscription] = useState<any>(null);
   const navigate = useNavigate();
 
   useEffect(() => {
@@ .. @@
       if (session?.user) {
         setUser(session.user);
+        // Fetch subscription data
+        getUserSubscription().then(setSubscription).catch(console.error);
       } else {
         setUser(null);
+        setSubscription(null);
       }
     });
 
@@ .. @@
     setUser(null);
+    setSubscription(null);
     navigate('/login');
   };
 
@@ .. @@
               <div className="flex items-center space-x-4">
                 <Link
                   to="/"
                   className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Dashboard
                 </Link>
+                <Link
+                  to="/subscription"
+                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
+                >
+                  <Crown className="h-4 w-4 mr-1" />
+                  {subscription?.subscription_status === 'active' ? 'Pro' : 'Upgrade'}
+                </Link>
                 <div className="relative">
                   <button
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
@@ .. @@
                       <Link
                         to="/"
                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         Dashboard
                       </Link>
+                      <Link
+                        to="/subscription"
+                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
+                        onClick={() => setIsMenuOpen(false)}
+                      >
+                        <Crown className="h-4 w-4 mr-2" />
+                        {subscription?.subscription_status === 'active' ? 'Pro Plan' : 'Upgrade to Pro'}
+                      </Link>
                       <button
                         onClick={handleLogout}
                         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
@@ .. @@
             ) : (
               <div className="flex items-center space-x-4">
                 <Link
                   to="/login"
                   className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                 >
                   Sign In
                 </Link>
                 <Link
                   to="/signup"
                   className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                 >
                   Sign Up
                 </Link>
               </div>
             )}
           </div>
 
@@ .. @@
                 <Link
                   to="/"
                   className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Dashboard
                 </Link>
+                <Link
+                  to="/subscription"
+                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium flex items-center"
+                  onClick={() => setIsMenuOpen(false)}
+                >
+                  <Crown className="h-4 w-4 mr-2" />
+                  {subscription?.subscription_status === 'active' ? 'Pro Plan' : 'Upgrade to Pro'}
+                </Link>
                 <button
                   onClick={handleLogout}
                   className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
@@ .. @@
               </>
             ) : (
               <>
                 <Link
                   to="/login"
                   className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Sign In
                 </Link>
                 <Link
                   to="/signup"
                   className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Sign Up
                 </Link>
               </>
             )}
           </div>
         </div>
       )}
     </nav>
   );
 }