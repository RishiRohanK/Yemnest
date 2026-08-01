# Resolve conflicts by keeping our local changes
git checkout --ours src/app/checkout/CheckoutClient.tsx
git checkout --ours src/app/collections/CollectionsClient.tsx
git checkout --ours src/app/shop/ShopClient.tsx
git checkout --ours src/app/shop/[id]/ProductDetailClient.tsx

git add .
git commit -m "Resolve merge conflicts by keeping local changes"
git push -u origin main
