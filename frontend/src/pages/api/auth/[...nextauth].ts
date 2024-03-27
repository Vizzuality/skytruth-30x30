import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        /** Return `true` if the user and password are correct */
        const matchCredentials = (username: string, password: string) => {
          let valid = true;

          valid = username === process.env.HTTP_AUTH_USERNAME && valid;
          valid = password === process.env.HTTP_AUTH_PASSWORD && valid;

          return valid;
        };

        const validCredentials =
          !!credentials && matchCredentials(credentials.username, credentials.password);

        if (validCredentials) {
          return { id: 'shared-user' };
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
