# Release Notes

## 0.1.1 (08/12/25) - Fix bug with EC2 instance getting deleted on redeploy

### Prevent EC2 instance from getting deleted on 

- **Root cause**: S3 bucket name was being randomised on each deploy, which was causing the EC2 instance to be recreated - bucket name is referenced in the init commands for the instance
- Added `S3_BUCKET_SUFFIX` const to MineCloud Service Info file. This keeps the S3 bucket name consistent between deploys

### Additional Tidy-up
- Extract EC2 spot instance logic into its own 
- Replace Jest with built-in Node testing framework and add first test
- Remove unused packages `aws-lambda`, `uuidv4`, `jest`, `@types/jest`, `ts-jest`
- Standardise file names
- Tidy up imports in stack file
