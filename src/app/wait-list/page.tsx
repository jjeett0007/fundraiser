"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const WaitListPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to handle form submission, e.g., API call
        setSubmitted(true);
    };

    return (
        <div className="waitlist-page p-8 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Join Our Waitlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 text-center">Be the first to know when we launch!</p>
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full mb-4"
                            />
                            <Button type="submit" className="bg-blue-500 bg-[#FF3A20] hover:bg-[#e02e17] text-white text-lg py-6 px-8 rounded-xl px-4 py-2 rounded w-full">
                                Join
                            </Button>
                        </form>
                    ) : (
                        <p className="text-green-500 mt-4 text-center">Thank you for joining the waitlist!</p>
                    )}
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500">
                    We respect your privacy. Unsubscribe anytime.
                </CardFooter>
            </Card>
        </div>
    );
};

export default WaitListPage;
