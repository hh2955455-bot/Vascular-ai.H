# Security Specification & Test Plan

## 1. Data Invariants
- A user can only read, write, update, or delete their own user profile under `/users/{userId}` where `request.auth.uid == userId`.
- Notes under `/users/{userId}/notes/{noteId}` must have `incoming().userId == request.auth.uid == userId`.
- Flashcards under `/users/{userId}/flashcards/{flashcardId}` must belong to the user (`incoming().userId == request.auth.uid`).
- Uploaded Books under `/users/{userId}/books/{bookId}` must belong to the user.
- Book chunks under `/users/{userId}/books/{bookId}/chunks/{chunkId}` must belong to the book's owner (`request.auth.uid == userId`).
- Document IDs must satisfy `isValidId(id)` (alphanumeric, dash, underscore, max 128 chars).
- Unauthenticated or cross-user writes are rejected with `PERMISSION_DENIED`.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. Unauthenticated write to `/users/usr-123`: denied (no auth).
2. Authenticated user A writing to user B's profile `/users/usr-456`: denied (`auth.uid != userId`).
3. Payload with spoofed `userId` mismatching auth token: denied.
4. Payload with oversized ID (>128 chars or special characters): denied.
5. Note creation with missing required fields (`title` or `detailedContent`): denied.
6. Note update modifying immutable `createdAt` timestamp: denied.
7. Book creation with non-conforming status: denied.
8. Injection of arbitrary ghost fields via shadow update: denied.
9. Cross-user reading of notes or flashcards: denied.
10. Chunk upload to another user's book: denied.
11. Flashcard with invalid category string: denied.
12. Attempted write to unmapped collections outside `/users/{userId}`: denied by default deny catch-all.
