# TODO: Fix Token Persistence Issue

## Problem
Tokens are stored in server memory (`global.tokenStore`) which gets cleared on restart or doesn't work in serverless environments.

## Solution
Persist tokens to a JSON file (`data/tokens.json`).

## Steps

- [ ] 1. Update `src/app/api/admin/login/route.ts` - Use file-based token storage
- [ ] 2. Update `src/app/api/content/route.ts` - Use file-based token storage
- [ ] 3. Test the implementation

## Files to Edit
1. `src/app/api/admin/login/route.ts`
2. `src/app/api/content/route.ts`

