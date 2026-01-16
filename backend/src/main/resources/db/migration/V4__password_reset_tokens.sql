-- =====================================================
-- Password Reset Tokens Table
-- Version: V4
-- Description: Stores tokens for password reset functionality
-- =====================================================

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for token lookups
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Index for cleanup of expired tokens
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Cleanup old tokens (can be called via scheduled job)
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE;
