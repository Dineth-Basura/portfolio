import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  timeout:60000,
  workers:1,
  use:{baseURL:process.env.TEST_URL||'http://127.0.0.1:4321',channel:'chrome',headless:true},
  reporter:[['list'],['json',{outputFile:'test-results/results.json'}]],
});
