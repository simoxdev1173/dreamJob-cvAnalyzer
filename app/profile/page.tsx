"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconUser, IconMail, IconLock, IconTrash, IconArrowLeft } from '@tabler/icons-react';

export default function ProfilePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch user data on component load
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setName(data.name);
                setEmail(data.email);
                setImage(data.image || 'https://assets.aceternity.com/manu.png');
            } catch (error) {
                console.error(error);
                alert('Could not load your profile data.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string); // Show a preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        let imageUrl = image;
        // If a new image file was selected, you would upload it to a storage service here.
        // For this example, we'll just log it. Replace with your actual upload logic.
        if (imageFile) {
            console.log("Uploading new image:", imageFile.name);
            // const formData = new FormData();
            // formData.append('file', imageFile);
            // const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
            // const uploadData = await uploadRes.json();
            // imageUrl = uploadData.url; // URL from your storage (S3, Cloudinary, etc.)
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    password: newPassword || undefined, // Only send password if it's changed
                    image: imageUrl,
                }),
            });

            if (!res.ok) throw new Error('Failed to update profile');
            
            alert('Profile updated successfully!');
            setNewPassword(''); // Clear password field after update
        } catch (error) {
            console.error(error);
            alert('An error occurred while updating your profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            setIsDeleting(true);
            try {
                const res = await fetch('/api/profile', { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete account');
                alert('Account deleted successfully.');
                router.push('/'); // Redirect to home page
            } catch (error) {
                console.error(error);
                alert('An error occurred while deleting your account.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (isLoading) {
        return <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-900"><p>Loading profile...</p></div>;
    }

    return (
        <div className="flex min-h-screen w-full justify-center bg-gray-50 p-4 dark:bg-neutral-900">
            <div className="w-full max-w-2xl space-y-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                >
                    <IconArrowLeft size={16} />
                    Back to Dashboard
                </button>
                
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Account Settings</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your profile, password, and account settings.</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Profile Information</h2>
                        <div className="flex items-center gap-4">
                            <img src={image} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Change Photo
                                <input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Username</label>
                            <IconUser className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="username" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</label>
                            <IconMail className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="email" type="email" value={email} disabled
                                className="mt-1 w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 py-2.5 pl-10 pr-3 text-sm dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">New Password</label>
                            <IconLock className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 text-gray-400" />
                            <input
                                id="password" type="password" placeholder="Leave blank to keep current password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={isSaving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-red-500/30 bg-white p-6 shadow-sm dark:border-red-500/20 dark:bg-neutral-900/50">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">Delete Account</h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Once you delete your account, there is no going back. Please be certain.</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleDeleteAccount} disabled={isDeleting}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            <IconTrash className="h-4 w-4" />
                            {isDeleting ? 'Deleting...' : 'Delete My Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
