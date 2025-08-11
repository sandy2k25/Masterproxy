# M3U8 Proxy Service

## Overview

This is a professional M3U8 streaming proxy service built with React and Express.js. The application provides a clean, user-friendly interface for proxying M3U8 streaming URLs with automatic header injection. It serves as a middleware service that adds predefined headers (origin, referer, user-agent) to streaming requests, enabling seamless playback of protected streams without exposing authentication details in URLs.

The service features a modern dark-themed UI with comprehensive documentation, live demo functionality, and API reference materials. It's designed to handle both M3U8 playlist files and individual video segments (.ts files) while maintaining clean URL structures and providing detailed error handling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive shadcn/ui component system with Radix UI primitives

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Development**: Hot module replacement with Vite middleware integration
- **Proxy Logic**: Server-side URL proxying with predefined header injection for webxzplay.cfd domain

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle with schema migrations
- **ORM**: Drizzle ORM with Zod schema validation for type-safe database operations
- **Storage Interface**: Abstract storage interface with both PostgreSQL and in-memory implementations
- **Session Store**: PostgreSQL-backed session management for persistent user sessions

### Authentication and Authorization
- **Current State**: Basic user schema defined but not actively implemented
- **Session Management**: Express session middleware with PostgreSQL storage ready for future auth implementation
- **Security**: CORS handling and request validation middleware in place

### Core Proxy Functionality
- **M3U8 Processing**: Handles both playlist files and video segments with automatic URL rewriting
- **Header Injection**: Automatic application of origin, referer, and user-agent headers for webxzplay.cfd
- **Content Type Detection**: Proper MIME type handling for different streaming content types
- **Error Handling**: Comprehensive validation and error responses for invalid URLs or failed requests
- **Request Logging**: Database logging of all proxy requests for monitoring and analytics

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connectivity for serverless environments
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools for PostgreSQL
- **express**: Web application framework for the REST API backend
- **react & @vitejs/plugin-react**: Frontend framework and build tooling

### UI and Styling
- **tailwindcss**: Utility-first CSS framework for responsive design
- **@radix-ui/react-***: Headless UI primitives for accessible component foundations
- **lucide-react**: Modern icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs

### Development and Build Tools
- **typescript**: Type checking and enhanced development experience
- **vite**: Fast build tool and development server
- **@replit/vite-plugin-***: Replit-specific plugins for development environment integration

### Data Fetching and State Management
- **@tanstack/react-query**: Server state management and caching solution
- **wouter**: Lightweight routing library for single-page application navigation

### Validation and Forms
- **zod**: Runtime type validation and schema definition
- **react-hook-form**: Form management with validation support
- **@hookform/resolvers**: Integration between react-hook-form and validation libraries

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation schemas