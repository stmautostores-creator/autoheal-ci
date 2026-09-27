/**
 * SessionService handles session lifecycle, token generation, and state.
 */
class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Asynchronously creates a user session.
   * Simulates ~120ms network/DB persistence latency.
   *
   * @param {string} userId
   * @param {string} tenantId
   * @returns {Promise<Object>}
   */
  async createSession(userId, tenantId = "default") {
    if (!userId) {
      throw new Error("InvalidUserId: userId is required");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const session = {
          sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          tenantId,
          status: "active",
          createdAt: new Date().toISOString()
        };
        this.sessions.set(userId, session);
        resolve(session);
      }, 120);
    });
  }

  /**
   * Retrieves an active session by user ID.
   * @param {string} userId
   * @returns {Object|null}
   */
  getSession(userId) {
    return this.sessions.get(userId) || null;
  }

  /**
   * Revokes an active session.
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async revokeSession(userId) {
    const session = this.sessions.get(userId);
    if (!session) {
      return false;
    }
    session.status = "revoked";
    return true;
  }
}

module.exports = SessionService;