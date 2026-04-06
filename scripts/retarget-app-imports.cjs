const fs = require('fs');
const path = require('path');

const map = {
  Home: '@green-world/views/Home',
  Login: '@green-world/views/Login',
  Registration: '@green-world/views/Registration',
  ForgotPassword: '@green-world/views/ForgotPassword',
  BlogPost: '@green-world/views/BlogPost',
  BlogPostPage: '@green-world/views/BlogPostPage',
  WritePost: '@green-world/views/WritePost',
  UserProfile: '@green-world/views/UserProfile',
  CreateEditProduct: '@green-world/views/CreateEditProduct',
  Products: '@green-world/views/Products',
  ContactUs: '@green-world/views/ContactUs',
  Message: '@green-world/views/Message',
  ProductPage: '@green-world/views/ProductPage',
  OrderProduct: '@green-world/views/OrderProduct',
  Event: '@green-world/views/Event',
  Documents: '@green-world/views/Documents',
  CreateEditEvent: '@green-world/views/CreateEditEvent',
  PrivacyPolicy: '@green-world/views/PrivacyPolicy',
  PromoteProduct: '@green-world/views/PromoteProduct',
  PromoteShop: '@green-world/views/PromoteShop',
  IncreaseCapacity: '@green-world/views/IncreaseCapacity',
  PromoBundle: '@green-world/views/PromoBundle',
  Events: '@green-world/views/Events',
  Shops: '@green-world/views/Shops',
  ShopPage: '@green-world/views/ShopPage',
  ServiceListingPage: '@green-world/views/ServiceListing',
  CreateEditService: '@green-world/views/CreateEditService',
  ServiceDetailsPage: '@green-world/views/ServiceDetails',
  AdminPanel: '@green-world/views/AdminPanel',
  ProfileSettings: '@green-world/views/ProfileSettings',
  GoogleAnalytics: '@green-world/components/GoogleAnalytics',
  EditUserData: '@green-world/components/EditUser',
  EditUserImageSection: '@green-world/components/EditUser',
  EditUserChangePassword: '@green-world/components/EditUser',
  UserStatistics: '@green-world/components/UserStatistics'
};

const rootDir = path.resolve(process.cwd(), 'src/app/[locale]');

function walk(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.isFile() || !fullPath.endsWith('.tsx')) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const match = content.match(
      /import \{\s*([A-Za-z0-9_]+)\s*\} from '(@green-world\/views|@green-world\/components)';/
    );

    if (!match) continue;

    const symbol = match[1];
    const directImport = map[symbol];

    if (!directImport) continue;

    const updated = content.replace(
      match[0],
      `import {${symbol}} from '${directImport}';`
    );

    fs.writeFileSync(fullPath, updated);
  }
}

walk(rootDir);
console.log('Updated app route imports to direct modules.');
