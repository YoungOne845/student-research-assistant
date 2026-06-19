import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`Student Research Assistant API running on port ${env.PORT}`);
});
