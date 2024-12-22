import { app, safeStorage } from 'electron';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export class DesktopSessionManager {
  private static readonly SESSION_FILE = '.session';

  // Path to the session file
  private static getSessionPath(): string {
    return join(app.getPath('userData'), this.SESSION_FILE);
  }

  // Save the session token directly to secure storage using safeStorage
  private static async saveSessionToken(sessionToken: string): Promise<void> {
    try {
      // Encrypt the session token with safeStorage
      const encryptedTokenBuf = safeStorage.encryptString(sessionToken);
      await writeFile(this.getSessionPath(), encryptedTokenBuf);
    } catch (error) {
      console.error('Error saving session token:', error);
    }
  }

  // Retrieve the session token from secure storage
  private static async getSessionToken(): Promise<string | null> {
    try {
      const encryptedTokenBuf = await readFile(this.getSessionPath());

      // Ensure the token was successfully encrypted before decrypting
      if (!encryptedTokenBuf) {
        return null;
      }

      // Decrypt the session token using safeStorage
      const sessionToken = safeStorage.decryptString(encryptedTokenBuf);
      if (!sessionToken) {
        return null;
      }

      return sessionToken;
    } catch (error) {
      console.error('Error retrieving session token:', error);
      return null;
    }
  }

  // Save the session directly using safeStorage (no custom encryption)
  static async saveSession(sessionToken: string) {
    try {
      await this.saveSessionToken(sessionToken); // Save the session token directly
      return sessionToken;
    } catch (error) {
      console.error('Error saving session:', error);
    }
    return null;
  }

  // Retrieve the session token directly from storage
  static async getSession() {
    try {
      const sessionToken = await this.getSessionToken();
      return sessionToken;
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  // Clear the session from storage
  static async clearSession(): Promise<void> {
    try {
      await writeFile(this.getSessionPath(), Buffer.from(''));
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}
