<h1 align="center">
  Decsys
</h1>

<p align="center">
  Decsys is a KYC verification software that uses blockchain technology to ensure the security and transparency of user data storage. Its main functionality is to validate the information of a digital wallet owner through a KYC process. Additionally, Decsys allows users to check the status of any authenticated wallet within the platform using its wallet address, providing a reliable and decentralized verification system.
</p>

<p align="center">
  <a href="#usage">Usage</a> •
  <a href="#license">License</a>
</p>

## Usage

```sh
git clone https://github.com/gustavopettine/decsys-version-2

cd decsys-version-2
```

### Backend

```sh
cd backend

npm install

npx prisma migrate dev
```

```sh
docker compose up -d

npx prisma studio

npm run start:dev
```

### Frontend

```sh
cd frontend

npm install

npm run dev
```

## License

MIT
