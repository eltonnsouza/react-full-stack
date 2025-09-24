# Inspirational Quote and Reflection Generator - Developer Handover

## 1. Feature Overview >= Visão geral dos recursos 

### Purpose
We're adding an "Inspirational Quote and Reflection Generator" feature to Anahata Circle that will provide users with daily heart-centered quotes, affirmations, or insights with optional prompts for reflection. This feature aligns with our mission of supporting heart-centered healing and personal growth through regular touchpoints of inspiration.

### User Value
- Delivers bite-sized inspiration aligned with our heart-centered brand voice
- Creates a daily touchpoint with minimal user commitment
- Provides shareable content that could expand our reach
- Supports consistent mindfulness practice for our community members

### Expected Outcome
A fully functional feature that includes:

1. A curated collection of heart-centered quotes and reflections stored in the database
2. Beautiful UI components for displaying the daily quote/reflection
3. The ability for users to save their favorite quotes
4. Social sharing functionality for quotes and reflections
5. Optional reflection prompts to encourage deeper engagement
6. A "history" view where users can revisit past quotes or their saved favorites

## 2. Technical Requirements >= Requisitos Técnicos

### Database Models
Create the following models in the Prisma schema:

prisma
model InspirationQuote {
  id          String   @id @default(cuid())
  content     String   @db.Text
  author      String?
  source      String?
  category    String[] // e.g., ["love", "healing", "growth"]
  reflectionPrompt String? @db.Text
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  favorites   UserFavoriteQuote[]
}

model UserFavoriteQuote {
  id        String   @id @default(cuid())
  userId    String
  quoteId   String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quote     InspirationQuote @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  
  @@unique([userId, quoteId])
  @@index([userId])
}


Add the relation to the User model:
prisma
model User {
  // existing fields...
  favoriteQuotes UserFavoriteQuote[]
}


### API Endpoints (tRPC)
Create a new tRPC router for the quote feature with the following procedures:

1. getDailyQuote - Retrieve a quote for the day (should be the same for all users on a given day)
2. getFavorites - Get all quotes favorited by the current user
3. toggleFavorite - Add/remove a quote from user's favorites
4. getQuoteById - Get a specific quote by ID
5. getQuoteHistory - Get quotes from previous days

### UI Components
Create the following components:

1. QuoteCard.tsx - The main component displaying a quote and reflection prompt
2. FavoriteButton.tsx - To toggle a quote as favorite
3. ShareButton.tsx - To share quotes to social media
4. QuoteHistory.tsx - To display past quotes
5. FavoriteQuotes.tsx - To display user's favorite quotes
6. DailyReflection.tsx - Optional component for users to write their thoughts on the quote

### Pages
Create the following pages:

1. /inspiration - Main page displaying the quote of the day
2. /inspiration/favorites - Page showing user's favorite quotes
3. /inspiration/history - Page showing past quotes

## 3. Working with the Codebase >= Trabalhando com a base de código

### Using Cursor AI and Claude 3.7

Our project leverages Cursor AI with Claude 3.7 for enhanced development workflow. Here's how to make the most of it:

1. *Cursor Agent*: Use Cursor Agent (CMD+I or CTRL+I) to get contextual help while coding. It's particularly good at:
   - Understanding our project structure
   - Suggesting implementation approaches
   - Helping debug issues
   - Explaining existing code

2. *Cursor Rules*: Be sure to check the .cursor/rules folder which contains important guidelines for working with our codebase. These rules help maintain consistency and quality:
   
   - code-simplicity: Guidelines for clean, maintainable code
   - design-system: Our design system specifications
   - nextjs-app-router: Conventions for Next.js App Router usage
   - typescript: TypeScript best practices
   - tailwind: Tailwind CSS patterns and conventions
   - trpc: tRPC implementation patterns
   - supabase-prisma: Database access patterns
   

3. *Documentation*: The docs folder contains crucial information about our architecture, components, and domain models. Review these before starting development to understand the context.

### Tips for Efficient Development

1. Ask Cursor Agent to explain unfamiliar patterns or code before making changes.
2. Use Cursor Agent to help generate boilerplate code consistent with our coding style.
3. When stuck, ask Cursor "How would I implement X in this codebase?" with specific context.
4. Use Cursor to review your code before committing to catch potential issues.
5. Leverage Cursor to explore the codebase and understand related components.

## 4. Environment Setup >= Configuração do ambiente

### Local Development Setup

1. Clone the repository
2. Create a .env.local file based on the .env.example template (I'll provide the actual values separately)
3. Install dependencies with npm install
4. Run the development server with npm run dev

### Security Considerations ⚠️

- *IMPORTANT*: Never commit the .env.local file to git
- Never expose environment variables in client-side code
- Don't share API keys or secrets in comments, PRs, or any public forum
- If you accidentally commit secrets, alert the team immediately so we can rotate them

### Environment Variables

You'll need various environment variables for local development, which I'll provide separately. These include:
- Database connection strings
- Authentication provider keys
- API endpoints

## 5. Development Workflow >= Fluxo de trabalho de desenvolvimento

### Branching Strategy

1. Always branch off from main for your feature development
2. Use a descriptive branch name like feature/inspirational-quotes
3. Keep your changes isolated to only the files related to this feature
4. Make regular commits with clear, descriptive messages

### Pull Request Process

1. When the feature is complete, create a PR to main
2. Provide a clear description of the changes and any notes for review
3. Address any feedback during the review process

## 6. Design Guidelines >= Diretrizes de projeto

### UI/UX Expectations

- Follow our heart-centered design aesthetic with warm, inviting UI elements
- Use the existing component library in src/components/ui
- Ensure the feature is fully responsive for mobile, tablet, and desktop
- Incorporate subtle animations for favoriting and sharing actions

### Design System

Our design system is implemented using Tailwind CSS and shadcn/ui components. Refer to:

1. Our tailwind configuration in tailwind.config.ts for colors, spacing, etc.
2. Existing UI components in src/components/ui
3. Brand guidelines in docs/brand for tone and styling

### Accessibility 

- Ensure all UI elements are keyboard navigable
- Maintain appropriate contrast ratios
- Use semantic HTML elements
- Include proper aria attributes where needed

## 7. Codebase Overview >= Visão geral da base de código

### Architecture

Anahata Circle is built using the T3 stack:

- *Next.js App Router*: For routing and server components
- *TypeScript*: For type safety throughout the application
- *tRPC*: For end-to-end typesafe APIs
- *Prisma*: For database access and migrations
- *Tailwind CSS*: For styling
- *Supabase*: For database and authentication
- *Stripe*: For payment processing

### Key Directories

- src/app: Pages and routes (Next.js App Router)
- src/components: React components
- src/server: Server-side code
- src/trpc: tRPC router definitions
- src/lib: Utility functions and shared code
- prisma: Database schema and migrations
- public: Static assets

### Important Files

- prisma/schema.prisma: Database schema
- src/trpc/router.ts: API route definitions
- src/app/layout.tsx: Root layout component
- tailwind.config.ts: Tailwind configuration
- src/lib/auth.ts: Authentication utilities

### Data Flow

1. Client components use React Query hooks generated by tRPC
2. These hooks call tRPC procedures defined in the router
3. The procedures interact with the database via Prisma
4. Data is returned to the client with full type safety

## 8. Additional Guidance >= Orientação Adicional

### Best Practices

- *Keep components small and focused* - Prefer smaller, reusable components
- *Use server components where possible* - Leverage Next.js App Router's server components for data fetching
- *Follow existing patterns* - Look at similar features to understand our implementation patterns
- *Type everything* - Ensure all functions, components, and variables are properly typed
- *Use existing UI components* - Don't reinvent the wheel; use our component library

### Common Pitfalls

- Mixing client and server code incorrectly (watch out for "use client" directives)
- Overcomplicating component structure
- Not handling loading and error states
- Insufficient mobile testing

### Getting Help

If you get stuck:

1. Use Cursor Agent to understand existing code patterns
2. Check the docs folder for guidance
3. Look at similar features for implementation patterns
4. If all else fails, document your specific question clearly, with context, and we'll address it

## 9. Next Steps >= Próximas etapas

1. Review this document thoroughly
2. Explore the codebase to understand the architecture and patterns
3. Set up your local development environment
4. Create a new branch for feature development
5. Implement the database models and run migrations
6. Develop the tRPC routes
7. Create UI components and pages
8. Test the feature thoroughly across devices
9. Create a PR for review

Remember, the goal is to create a feature that fits seamlessly into our existing application while providing value to our users in their healing journey.

Good luck!