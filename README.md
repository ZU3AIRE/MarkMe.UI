## Development Setup

#### Clone the repo by using the following command:

```bash
git clone https://github.com/ZU3AIRE/mark-me.git 
```
The stable branch is main:
```bash
git checkout main
```
#### Run the following command to install the dependencies:
```bash
npm install
```
#### Create `.env.local` file in the root of the directory
Add the keys from the [Clerk](https://clerk.com/)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=********************************
CLERK_SECRET_KEY=********************************
DOTNET_API_URL=<api_base_url>
NODE_TLS_REJECT_UNAUTHORIZED="0"
```
#### Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Steps For PR Review

First, stiwtch to the specified branch according to the PR or clone the specified branch.

```bash
git fetch origin
git checkout <branch-name>
```

second, take the latest pull of the branch by running following command:

``` bash
git pull
```

third, run the following command to install the dependencies:

```bash
npm install
```

fourth, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Things need to check 
- There should be no irrelevant changes or irrelevant file in the PR.
- The project should run succesfully in that branch.
