// Import necessary modules
import jwt from 'jsonwebtoken';
import config from '../config';

// Other codes...

// Create JWT token
const token = jwt.sign({
  sub: accountant.id.toString(),
  // other properties...
}, config.jwtSecret);

// Other codes...

// Another instance of JWT token creation
const tokenClient = jwt.sign({
  sub: client.id.toString(),
  // other properties...
}, config.jwtSecret);

// More codes...

// At line 134
const anotherToken = jwt.sign({
  sub: client.id.toString(),
  // other properties...
}, config.jwtSecret);

// End of file...