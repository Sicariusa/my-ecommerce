export const SUGGESTIONS = [
  {
    title: 'E-Commerce Store',
    prompt: `Build a fully-featured online store with product listing, shopping cart, checkout, order management, and admin dashboard. Include the following features:

- Product catalog with search and filtering
- Shopping cart with add/remove items and quantity updates
- Checkout process that creates orders
- User order history
- Admin dashboard for product management (create, update, delete)
- Admin dashboard for viewing and managing all orders
- Role-based access control (user and admin roles)
- Real-time updates for product availability and order status`,
  },
  {
    title: 'Enhance Website Builder Project',
    prompt: `Enhance an existing website builder project by modifying the project JSON structure. The project contains pages with component trees, where each component has an id, type, props, styles, metadata, and children.

Available component types: Body (root), Section, Div, Text, Image, Button, Container, Grid, List, Link, Form

When enhancing:
- Preserve existing component IDs unless creating new components
- Maintain the project JSON structure exactly
- Add new pages or modify existing ones as requested
- Update component properties, styles, and structure
- Ensure all changes are valid and maintain hierarchy (Body must be root)

Example enhancement: "Add a contact form section with name, email, and message fields to the home page"`,
  },
];

export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;

export const PREWARM_PATHS = [
  `${WORK_DIR}/package.json`,
  `${WORK_DIR}/convex/schema.ts`,
  `${WORK_DIR}/convex/products.ts`,
  `${WORK_DIR}/convex/cart.ts`,
  `${WORK_DIR}/convex/orders.ts`,
  `${WORK_DIR}/convex/roles.ts`,
  `${WORK_DIR}/src/App.tsx`,
  `${WORK_DIR}/src/pages/HomePage.tsx`,
  `${WORK_DIR}/src/components/ProductCard.tsx`,
  `${WORK_DIR}/src/index.css`,
  // Builder-related paths
  `${WORK_DIR}/builder/project.json`,
  `${WORK_DIR}/builder/components`,
];

// A list of files that we block the LLM from modifying
export const EXCLUDED_FILE_PATHS = [
  'convex/auth.ts',
  'convex/http.ts',
  'src/main.tsx',
  'src/SignInForm.tsx',
  'src/SignOutButton.tsx',
  'vite.config.ts',
  'package.json',
];
