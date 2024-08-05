import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/app/firebase";

export const authOptions = {
    pages: {
        signIn: '/signin',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
                    if (userCredential.user) {
                        return {
                            id: userCredential.user.uid,
                            email: userCredential.user.email
                        };
                    }
                    return null;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
