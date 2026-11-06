import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectStatus, PriorityLevel } from '../models/project.model';
import { Task, TaskStatus } from '../models/task.model';
import { User, MemberStatus } from '../models/user.model';
import { Team } from '../models/team.model';
import { CalendarEvent } from '../models/event.model';
import { Activity } from '../models/activity.model';
import { AppNotification } from '../models/notification.model';
import { DocumentItem } from '../models/document.model';
import { Goal } from '../models/goal.model';
import { ChatChannel, ChatMessage } from '../models/chat.model';
import { TimeEntry } from '../models/time-entry.model';
import { MemberWorkload } from '../models/resource.model';
import { RoleDefinition } from '../models/role-permission.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Current Authenticated User
  public currentUser = signal<User>({
    id: 'usr-1',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@vertex.enterprise',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    roleTitle: 'Enterprise Admin / VP Engineering',
    department: 'Engineering',
    status: 'online',
    statusMessage: 'Reviewing Q4 Architecture Blueprints',
    timezone: 'IST (UTC+5:30)',
    location: 'Bengaluru (HQ)',
    phone: '+1 (617) 555-0192',
    joinedDate: '2023-03-15',
    lastActive: 'Just now',
    activeProjectsCount: 5,
    openTasksCount: 14,
    completedTasksCount: 88,
    workloadPercentage: 84,
    bio: 'VP of Engineering & Enterprise Admin steering Vertex high-throughput distributed systems, event mesh infrastructure, and zero-trust compliance.',
    skills: [
      { name: 'Distributed Systems', level: 'expert' },
      { name: 'Angular Architecture', level: 'expert' },
      { name: 'Kubernetes & Service Mesh', level: 'expert' },
      { name: 'Kafka & Event Sourcing', level: 'proficient' },
      { name: 'Security & Compliance', level: 'proficient' }
    ],
    teamIds: ['team-1', 'team-3']
  });

  // Projects Signal
  public projects = signal<Project[]>([
    {
      id: 'proj-1',
      key: 'PRJ-ALPHA',
      name: 'Next-Gen Cloud Orchestrator',
      description: 'Next-generation multi-region hybrid cloud deployment with automated failover, Istio service mesh, and sub-10ms inter-region latency.',
      ownerId: 'usr-1',
      ownerName: 'Ananya Iyer',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-3',
      teamName: 'Cloud & Infrastructure',
      status: 'active',
      priority: 'critical',
      progress: 68,
      startDate: '2026-08-01',
      deadline: '2026-12-15',
      budget: { allocated: 42500000, spent: 30000000, currency: 'INR' },
      health: 'healthy',
      healthScore: 92,
      memberIds: ['usr-1', 'usr-2', 'usr-5', 'usr-8', 'usr-12'],
      tasksCount: 28,
      completedTasksCount: 19,
      tags: ['Infrastructure', 'Kubernetes', 'Multi-Region', 'High-Priority'],
      milestones: [
        { id: 'm-1', title: 'Phase 1: VPC Peering & Transit Gateway', dueDate: '2026-09-15', completed: true, tasksCount: 8, completedTasksCount: 8 },
        { id: 'm-2', title: 'Phase 2: Istio Ingress & Mutual TLS', dueDate: '2026-10-30', completed: true, tasksCount: 10, completedTasksCount: 10 },
        { id: 'm-3', title: 'Phase 3: Automated Failover Drill', dueDate: '2026-11-25', completed: false, tasksCount: 6, completedTasksCount: 1 },
        { id: 'm-4', title: 'Phase 4: Production Cutover', dueDate: '2026-12-15', completed: false, tasksCount: 4, completedTasksCount: 0 }
      ],
      risks: [
        { id: 'r-1', title: 'Cross-zone egress bandwidth burst spikes', level: 'medium', mitigation: 'Provisioned dedicated direct connects with rate-limiting fallback', ownerName: 'Deepak Chawla' }
      ],
      updatedAt: '2026-11-04T16:30:00Z'
    },
    {
      id: 'proj-2',
      key: 'PRJ-AURA',
      name: 'Vertex Design System 4.0',
      description: 'Comprehensive enterprise design token unification, accessible WCAG 2.2 AAA components, dark/light theme engine, and micro-interaction suite.',
      ownerId: 'usr-3',
      ownerName: 'Pooja Sundaram',
      ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-2',
      teamName: 'Design Systems',
      status: 'active',
      priority: 'high',
      progress: 82,
      startDate: '2026-07-15',
      deadline: '2026-11-30',
      budget: { allocated: 180000, spent: 147500, currency: 'INR' },
      health: 'healthy',
      healthScore: 96,
      memberIds: ['usr-3', 'usr-6', 'usr-9', 'usr-15'],
      tasksCount: 22,
      completedTasksCount: 18,
      tags: ['Design System', 'Figma Tokens', 'Accessibility', 'SCSS'],
      milestones: [
        { id: 'm-21', title: 'Color Palette & Typographic Scale', dueDate: '2026-08-30', completed: true, tasksCount: 6, completedTasksCount: 6 },
        { id: 'm-22', title: 'Core Form & Navigation Components', dueDate: '2026-10-15', completed: true, tasksCount: 9, completedTasksCount: 9 },
        { id: 'm-23', title: 'Complex Data Grid & Visualizations', dueDate: '2026-11-30', completed: false, tasksCount: 7, completedTasksCount: 3 }
      ],
      risks: [
        { id: 'r-21', title: 'Legacy component backward compatibility', level: 'low', mitigation: 'Automated codemod migration script created for Angular templates', ownerName: 'Pooja Sundaram' }
      ],
      updatedAt: '2026-11-05T09:15:00Z'
    },
    {
      id: 'proj-3',
      key: 'PRJ-SHIELD',
      name: 'Zero-Trust Identity Fabric',
      description: 'FIDO2 WebAuthn passwordless authentication, Okta/Azure AD SAML 2.0 federation, and granular role-based resource permissions engine.',
      ownerId: 'usr-4',
      ownerName: 'Vikram Malhotra',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-6',
      teamName: 'Enterprise Security',
      status: 'at_risk',
      priority: 'critical',
      progress: 44,
      startDate: '2026-09-01',
      deadline: '2026-12-01',
      budget: { allocated: 320000, spent: 210000, currency: 'INR' },
      health: 'at_risk',
      healthScore: 58,
      memberIds: ['usr-1', 'usr-4', 'usr-11', 'usr-14'],
      tasksCount: 24,
      completedTasksCount: 10,
      tags: ['Security', 'Auth', 'SAML', 'Zero-Trust', 'Audit'],
      milestones: [
        { id: 'm-31', title: 'WebAuthn Hardware Token Integration', dueDate: '2026-10-01', completed: true, tasksCount: 7, completedTasksCount: 7 },
        { id: 'm-32', title: 'SAML 2.0 Multi-Tenant Broker', dueDate: '2026-11-10', completed: false, tasksCount: 9, completedTasksCount: 3 },
        { id: 'm-33', title: 'SOC2 Type II Audit Readiness', dueDate: '2026-12-01', completed: false, tasksCount: 8, completedTasksCount: 0 }
      ],
      risks: [
        { id: 'r-31', title: 'Vendor API breaking changes in OAuth claims', level: 'high', mitigation: 'Engineered custom payload normalizer layer in edge proxy', ownerName: 'Vikram Malhotra' }
      ],
      updatedAt: '2026-11-05T11:45:00Z'
    },
    {
      id: 'proj-4',
      key: 'PRJ-HELIOS',
      name: 'Telemetry & Observability Mesh',
      description: 'Distributed Apache Kafka pipeline processing 450k events/sec with Apache Flink stream processing and ClickHouse columnar time-series storage.',
      ownerId: 'usr-2',
      ownerName: 'Rohan Deshmukh',
      ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-5',
      teamName: 'Data Intelligence',
      status: 'active',
      priority: 'high',
      progress: 74,
      startDate: '2026-06-01',
      deadline: '2026-12-20',
      budget: { allocated: 520000, spent: 395000, currency: 'INR' },
      health: 'healthy',
      healthScore: 89,
      memberIds: ['usr-2', 'usr-7', 'usr-13', 'usr-17'],
      tasksCount: 30,
      completedTasksCount: 22,
      tags: ['Kafka', 'Analytics', 'ClickHouse', 'BigData', 'Realtime'],
      milestones: [
        { id: 'm-41', title: 'Schema Registry & Ingestion Gateway', dueDate: '2026-08-15', completed: true, tasksCount: 10, completedTasksCount: 10 },
        { id: 'm-42', title: 'Aggregations & Rolling Window Queries', dueDate: '2026-10-31', completed: true, tasksCount: 12, completedTasksCount: 12 },
        { id: 'm-43', title: 'Analytics REST & WebSocket Gateway', dueDate: '2026-12-20', completed: false, tasksCount: 8, completedTasksCount: 0 }
      ],
      updatedAt: '2026-11-03T18:00:00Z'
    },
    {
      id: 'proj-5',
      key: 'PRJ-APOLLO',
      name: 'High-Frequency Streaming Engine',
      description: 'Re-architected enterprise companion mobile app built for field managers, real-time push alerts, offline sync, and cryptographic biometric sign-in.',
      ownerId: 'usr-8',
      ownerName: 'Rajesh Sengupta',
      ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-4',
      teamName: 'Mobile Experience',
      status: 'active',
      priority: 'medium',
      progress: 55,
      startDate: '2026-08-15',
      deadline: '2027-01-30',
      budget: { allocated: 290000, spent: 165000, currency: 'INR' },
      health: 'healthy',
      healthScore: 88,
      memberIds: ['usr-8', 'usr-10', 'usr-16'],
      tasksCount: 20,
      completedTasksCount: 11,
      tags: ['Mobile', 'iOS', 'Android', 'Offline-First'],
      milestones: [
        { id: 'm-51', title: 'Local SQLite & CRDT Sync Engine', dueDate: '2026-10-15', completed: true, tasksCount: 8, completedTasksCount: 8 },
        { id: 'm-52', title: 'Biometrics & Push Notification Gateway', dueDate: '2026-12-10', completed: false, tasksCount: 7, completedTasksCount: 3 },
        { id: 'm-53', title: 'App Store & TestFlight Beta Candidate', dueDate: '2027-01-30', completed: false, tasksCount: 5, completedTasksCount: 0 }
      ],
      updatedAt: '2026-11-04T14:20:00Z'
    },
    {
      id: 'proj-6',
      key: 'PRJ-SYNAPSE',
      name: 'Enterprise AI Gateway & Orchestration',
      description: 'Supergraph Apollo Router consolidating 18 microservices into a single declarative API contract with Subgraph caching and rate limiting.',
      ownerId: 'usr-5',
      ownerName: 'Arjun Nambiar',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-1',
      teamName: 'Core Platform',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startDate: '2026-04-01',
      deadline: '2026-10-15',
      budget: { allocated: 210000, spent: 198000, currency: 'INR' },
      health: 'healthy',
      healthScore: 100,
      memberIds: ['usr-1', 'usr-5', 'usr-7', 'usr-18'],
      tasksCount: 18,
      completedTasksCount: 18,
      tags: ['GraphQL', 'Federation', 'API', 'Apollo', 'Microservices'],
      milestones: [
        { id: 'm-61', title: 'Router Rust Deployment', dueDate: '2026-06-30', completed: true, tasksCount: 6, completedTasksCount: 6 },
        { id: 'm-62', title: 'Microservice Schema Contracts', dueDate: '2026-08-31', completed: true, tasksCount: 8, completedTasksCount: 8 },
        { id: 'm-63', title: 'Final Production Canary Cutover', dueDate: '2026-10-15', completed: true, tasksCount: 4, completedTasksCount: 4 }
      ],
      updatedAt: '2026-10-16T11:00:00Z'
    },
    {
      id: 'proj-7',
      key: 'PRJ-QUANTUM',
      name: 'Supply Chain Automation Core',
      description: 'Automated evidence collection for ISO 27001, SOC2, HIPAA, and GDPR across AWS, GCP, and GitHub repositories with automated remediation.',
      ownerId: 'usr-4',
      ownerName: 'Vikram Malhotra',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-6',
      teamName: 'Enterprise Security',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: '2026-11-01',
      deadline: '2027-03-31',
      budget: { allocated: 250000, spent: 34000, currency: 'INR' },
      health: 'healthy',
      healthScore: 90,
      memberIds: ['usr-4', 'usr-11', 'usr-19'],
      tasksCount: 14,
      completedTasksCount: 2,
      tags: ['Compliance', 'SOC2', 'ISO27001', 'Security', 'Automation'],
      milestones: [
        { id: 'm-71', title: 'Evidence Collector Daemon', dueDate: '2026-12-30', completed: false, tasksCount: 5, completedTasksCount: 2 },
        { id: 'm-72', title: 'Automated Drift Remediation', dueDate: '2027-02-15', completed: false, tasksCount: 5, completedTasksCount: 0 },
        { id: 'm-73', title: 'Executive Audit Dashboard', dueDate: '2027-03-31', completed: false, tasksCount: 4, completedTasksCount: 0 }
      ],
      updatedAt: '2026-11-04T10:00:00Z'
    },
    {
      id: 'proj-8',
      key: 'PRJ-CYPHPS',
      name: 'FinTech Settlement Ledger',
      description: 'Machine learning heuristics modeling historical team velocity, estimating ticket risk factors, and forecasting project completion with 94% precision.',
      ownerId: 'usr-2',
      ownerName: 'Rohan Deshmukh',
      ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-5',
      teamName: 'Data Intelligence',
      status: 'active',
      priority: 'high',
      progress: 60,
      startDate: '2026-07-01',
      deadline: '2026-12-31',
      budget: { allocated: 380000, spent: 235000, currency: 'INR' },
      health: 'healthy',
      healthScore: 85,
      memberIds: ['usr-2', 'usr-1', 'usr-13', 'usr-20'],
      tasksCount: 26,
      completedTasksCount: 15,
      tags: ['AI/ML', 'Predictive', 'ResourceManagement', 'Python'],
      milestones: [
        { id: 'm-81', title: 'Feature Store & Model Training Pipeline', dueDate: '2026-09-30', completed: true, tasksCount: 10, completedTasksCount: 10 },
        { id: 'm-82', title: 'Recommendation Inference Service', dueDate: '2026-11-20', completed: false, tasksCount: 9, completedTasksCount: 5 },
        { id: 'm-83', title: 'Planner UI Integration & Feedback Loop', dueDate: '2026-12-31', completed: false, tasksCount: 7, completedTasksCount: 0 }
      ],
      updatedAt: '2026-11-05T08:30:00Z'
    },
    {
      id: 'proj-9',
      key: 'ORB-909',
      name: 'Legacy Monolith Database Sharding & Partitioning',
      description: 'Zero-downtime PostgreSQL 16 horizontal sharding using Citus extension, historical partitioning, and dual-write synchronizer.',
      ownerId: 'usr-12',
      ownerName: 'Priya Sharma',
      ownerAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-3',
      teamName: 'Cloud & Infrastructure',
      status: 'on_hold',
      priority: 'high',
      progress: 35,
      startDate: '2026-05-15',
      deadline: '2026-12-10',
      budget: { allocated: 310000, spent: 145000, currency: 'INR' },
      health: 'needs_attention',
      healthScore: 64,
      memberIds: ['usr-1', 'usr-12', 'usr-5'],
      tasksCount: 16,
      completedTasksCount: 5,
      tags: ['PostgreSQL', 'Database', 'Sharding', 'Citus', 'Migration'],
      milestones: [
        { id: 'm-91', title: 'Partitioning Strategy & Benchmark', dueDate: '2026-07-31', completed: true, tasksCount: 5, completedTasksCount: 5 },
        { id: 'm-92', title: 'Staging Replay & Shadow Writes', dueDate: '2026-10-15', completed: false, tasksCount: 6, completedTasksCount: 0 }
      ],
      risks: [
        { id: 'r-91', title: 'Locked transaction contention on billing tables', level: 'high', mitigation: 'Paused pending Q4 e-commerce peak freeze', ownerName: 'Priya Sharma' }
      ],
      updatedAt: '2026-11-01T15:00:00Z'
    },
    {
      id: 'proj-10',
      key: 'ORB-010',
      name: 'Ecosystem Developer Platform & Public REST/Webhook API v2',
      description: 'Modern developer portal with interactive OpenAPI spec explorer, SDK generators for TS/Go/Python, and cryptographic webhook signing.',
      ownerId: 'usr-5',
      ownerName: 'Arjun Nambiar',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-7',
      teamName: 'Customer Solutions',
      status: 'active',
      priority: 'medium',
      progress: 50,
      startDate: '2026-08-01',
      deadline: '2027-02-15',
      budget: { allocated: 220000, spent: 112000, currency: 'INR' },
      health: 'healthy',
      healthScore: 87,
      memberIds: ['usr-5', 'usr-14', 'usr-18'],
      tasksCount: 18,
      completedTasksCount: 9,
      tags: ['API', 'DeveloperPortal', 'Webhooks', 'SDK'],
      milestones: [
        { id: 'm-101', title: 'OpenAPI 3.1 Contract Definition', dueDate: '2026-09-30', completed: true, tasksCount: 6, completedTasksCount: 6 },
        { id: 'm-102', title: 'Developer Portal Sandbox & Keys', dueDate: '2026-12-15', completed: false, tasksCount: 7, completedTasksCount: 3 }
      ],
      updatedAt: '2026-11-03T12:00:00Z'
    },
    {
      id: 'proj-11',
      key: 'ORB-011',
      name: 'Enterprise Audit Trail & Immutable Log Archive',
      description: 'Tamper-proof write-once read-many (WORM) audit archiving leveraging S3 Glacier Object Lock and cryptographic hash chaining.',
      ownerId: 'usr-11',
      ownerName: 'Siddharth Joshi',
      ownerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      teamId: 'team-6',
      teamName: 'Enterprise Security',
      status: 'archived',
      priority: 'low',
      progress: 100,
      startDate: '2026-01-10',
      deadline: '2026-06-30',
      budget: { allocated: 150000, spent: 142000, currency: 'INR' },
      health: 'healthy',
      healthScore: 100,
      memberIds: ['usr-11', 'usr-4'],
      tasksCount: 12,
      completedTasksCount: 12,
      tags: ['Audit', 'Compliance', 'Archival', 'Security'],
      milestones: [
        { id: 'm-111', title: 'Archive Daemon Deployment', dueDate: '2026-06-30', completed: true, tasksCount: 12, completedTasksCount: 12 }
      ],
      updatedAt: '2026-07-01T08:00:00Z'
    }
  ]);

  // Team Members Signal (20 Members)
  public users = signal<User[]>([
    {
      id: 'usr-1',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      roleTitle: 'Principal Solutions Architect',
      department: 'Core Architecture & Platform',
      status: 'online',
      statusMessage: 'Reviewing Q4 Architecture Blueprints',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru (HQ)',
      phone: '+1 (617) 555-0192',
      joinedDate: '2023-03-15',
      lastActive: 'Just now',
      activeProjectsCount: 5,
      openTasksCount: 14,
      completedTasksCount: 88,
      workloadPercentage: 84,
      bio: 'Lead architect steering Vertex high-throughput distributed systems, event mesh infrastructure, and zero-trust enterprise compliance.',
      skills: [{ name: 'Distributed Systems', level: 'expert' }, { name: 'Angular Architecture', level: 'expert' }],
      teamIds: ['team-1', 'team-3']
    },
    {
      id: 'usr-2',
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'team_lead',
      roleTitle: 'Director of Data Intelligence',
      department: 'Data Intelligence',
      status: 'online',
      statusMessage: 'In team sprint retrospective',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru',
      joinedDate: '2023-06-01',
      lastActive: '5m ago',
      activeProjectsCount: 3,
      openTasksCount: 8,
      completedTasksCount: 72,
      workloadPercentage: 78,
      bio: 'Specialized in real-time streaming architectures, ClickHouse performance tuning, and ML model inference engines.',
      skills: [{ name: 'Kafka', level: 'expert' }, { name: 'Flink', level: 'expert' }, { name: 'ClickHouse', level: 'proficient' }],
      teamIds: ['team-5']
    },
    {
      id: 'usr-3',
      name: 'Pooja Sundaram',
      email: 'pooja.sundaram@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'designer',
      roleTitle: 'Staff Design Systems Architect',
      department: 'Design Systems',
      status: 'busy',
      statusMessage: 'Deep work: WCAG 2.2 contrast auditing',
      timezone: 'IST (UTC+5:30)',
      location: 'Pune',
      joinedDate: '2023-09-10',
      lastActive: '12m ago',
      activeProjectsCount: 2,
      openTasksCount: 9,
      completedTasksCount: 95,
      workloadPercentage: 92,
      bio: 'Pioneer of the Graphite enterprise visual system, design tokens, micro-interactions, and high-density data visualizations.',
      skills: [{ name: 'Figma Tokens', level: 'expert' }, { name: 'SCSS Architecture', level: 'expert' }, { name: 'Accessibility', level: 'expert' }],
      teamIds: ['team-2']
    },
    {
      id: 'usr-4',
      name: 'Vikram Malhotra',
      email: 'vikram.malhotra@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'project_manager',
      roleTitle: 'Head of Enterprise Security & Trust',
      department: 'Enterprise Security',
      status: 'online',
      statusMessage: 'Reviewing SOC2 Type II audit logs',
      timezone: 'IST (UTC+5:30)',
      location: 'Mumbai',
      joinedDate: '2022-11-20',
      lastActive: '2m ago',
      activeProjectsCount: 4,
      openTasksCount: 11,
      completedTasksCount: 114,
      workloadPercentage: 89,
      bio: 'Leading enterprise posture, threat modeling, OAuth2/SAML identity brokers, and automated continuous compliance.',
      skills: [{ name: 'Cybersecurity', level: 'expert' }, { name: 'Zero-Trust', level: 'expert' }, { name: 'SOC2 / ISO', level: 'expert' }],
      teamIds: ['team-6']
    },
    {
      id: 'usr-5',
      name: 'Arjun Nambiar',
      email: 'arjun.nambiar@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Staff Backend & API Engineer',
      department: 'Core Platform',
      status: 'online',
      statusMessage: 'Optimizing Rust Apollo Router',
      timezone: 'IST (UTC+5:30)',
      location: 'Gurugram',
      joinedDate: '2024-01-08',
      lastActive: 'Just now',
      activeProjectsCount: 3,
      openTasksCount: 7,
      completedTasksCount: 64,
      workloadPercentage: 75,
      bio: 'High-performance backend systems, distributed consensus algorithms, and ultra-reliable GraphQL subgraphs.',
      skills: [{ name: 'Rust', level: 'expert' }, { name: 'GraphQL Supergraph', level: 'expert' }, { name: 'Go', level: 'proficient' }],
      teamIds: ['team-1', 'team-7']
    },
    {
      id: 'usr-6',
      name: 'Devendra Verma',
      email: 'devendra.verma@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Senior Frontend Engineer',
      department: 'Design Systems',
      status: 'online',
      statusMessage: 'Refactoring Kanban drag-drop physics',
      timezone: 'IST (UTC+5:30)',
      location: 'Hyderabad',
      joinedDate: '2024-02-15',
      lastActive: '1m ago',
      activeProjectsCount: 2,
      openTasksCount: 6,
      completedTasksCount: 48,
      workloadPercentage: 80,
      bio: 'Specialist in high-framerate Angular animations, virtualized list rendering, and state management.',
      skills: [{ name: 'Angular 20+', level: 'expert' }, { name: 'TypeScript', level: 'expert' }, { name: 'RxJS/Signals', level: 'expert' }],
      teamIds: ['team-2']
    },
    {
      id: 'usr-7',
      name: 'Kavita Krishnan',
      email: 'kavita.krishnan@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Senior Data Engineer',
      department: 'Data Intelligence',
      status: 'away',
      statusMessage: 'Stepped away for lunch',
      timezone: 'IST (UTC+5:30)',
      location: 'Mumbai',
      joinedDate: '2023-10-05',
      lastActive: '34m ago',
      activeProjectsCount: 2,
      openTasksCount: 5,
      completedTasksCount: 52,
      workloadPercentage: 68,
      bio: 'Constructing resilient data pipelines with dbt, Snowflake, and streaming ClickHouse replicas.',
      skills: [{ name: 'dbt', level: 'expert' }, { name: 'SQL Analytics', level: 'expert' }, { name: 'Python', level: 'proficient' }],
      teamIds: ['team-5']
    },
    {
      id: 'usr-8',
      name: 'Rajesh Sengupta',
      email: 'rajesh.sengupta@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'team_lead',
      roleTitle: 'Lead Mobile Architect',
      department: 'Mobile Experience',
      status: 'online',
      statusMessage: 'Preparing TestFlight candidate build',
      timezone: 'IST (UTC+5:30)',
      location: 'Noida',
      joinedDate: '2023-04-12',
      lastActive: '8m ago',
      activeProjectsCount: 2,
      openTasksCount: 7,
      completedTasksCount: 61,
      workloadPercentage: 72,
      bio: 'Crafting native iOS & Android applications with offline-first synchronization and biometric security.',
      skills: [{ name: 'Swift', level: 'expert' }, { name: 'Kotlin', level: 'expert' }, { name: 'SQLite', level: 'proficient' }],
      teamIds: ['team-4']
    },
    {
      id: 'usr-9',
      name: 'Neha Patel',
      email: 'neha.patel@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'designer',
      roleTitle: 'Senior Product Designer',
      department: 'Design Systems',
      status: 'online',
      statusMessage: 'Designing timeline dependencies modal',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru',
      joinedDate: '2024-03-01',
      lastActive: '3m ago',
      activeProjectsCount: 2,
      openTasksCount: 5,
      completedTasksCount: 39,
      workloadPercentage: 65,
      bio: 'Passionate about interaction ergonomics, command palettes, and human-computer interface efficiency.',
      skills: [{ name: 'Product Design', level: 'expert' }, { name: 'Prototyping', level: 'expert' }, { name: 'User Research', level: 'proficient' }],
      teamIds: ['team-2']
    },
    {
      id: 'usr-10',
      name: 'Vikram Mehta',
      email: 'vikram.mehta@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Senior Mobile Engineer (Android)',
      department: 'Mobile Experience',
      status: 'busy',
      statusMessage: 'Fixing push notification intent handler',
      timezone: 'IST (UTC+5:30)',
      location: 'Chennai',
      joinedDate: '2024-04-10',
      lastActive: '15m ago',
      activeProjectsCount: 1,
      openTasksCount: 6,
      completedTasksCount: 33,
      workloadPercentage: 85,
      bio: 'Android core specialist focusing on Compose performance, background workers, and memory footprints.',
      skills: [{ name: 'Kotlin', level: 'expert' }, { name: 'Jetpack Compose', level: 'expert' }],
      teamIds: ['team-4']
    },
    {
      id: 'usr-11',
      name: 'Siddharth Joshi',
      email: 'siddharth.joshi@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'SecOps & Compliance Specialist',
      department: 'Enterprise Security',
      status: 'online',
      statusMessage: 'Scanning CVE vulnerability feeds',
      timezone: 'IST (UTC+5:30)',
      location: 'Dubai, UAE',
      joinedDate: '2023-08-18',
      lastActive: '7m ago',
      activeProjectsCount: 3,
      openTasksCount: 8,
      completedTasksCount: 57,
      workloadPercentage: 70,
      bio: 'Cloud security posture, Terraform automated guardrails, and cryptographic token validation.',
      skills: [{ name: 'SecOps', level: 'expert' }, { name: 'Terraform', level: 'expert' }, { name: 'AWS IAM', level: 'expert' }],
      teamIds: ['team-6']
    },
    {
      id: 'usr-12',
      name: 'Priya Sharma',
      email: 'priya.sharma@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Principal Database Reliability Engineer',
      department: 'Cloud & Infrastructure',
      status: 'online',
      statusMessage: 'Query plan tuning & index optimization',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru, India',
      joinedDate: '2023-01-20',
      lastActive: 'Just now',
      activeProjectsCount: 3,
      openTasksCount: 9,
      completedTasksCount: 102,
      workloadPercentage: 94,
      bio: 'PostgreSQL internals, horizontal sharding with Citus, and sub-millisecond execution plans.',
      skills: [{ name: 'PostgreSQL Internals', level: 'expert' }, { name: 'Database Sharding', level: 'expert' }, { name: 'Redis', level: 'expert' }],
      teamIds: ['team-3']
    },
    {
      id: 'usr-13',
      name: 'Aditya Kulkarni',
      email: 'aditya.kulkarni@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Machine Learning Engineer',
      department: 'Data Intelligence',
      status: 'offline',
      statusMessage: 'Out of office until tomorrow',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru',
      joinedDate: '2024-05-02',
      lastActive: '5h ago',
      activeProjectsCount: 2,
      openTasksCount: 4,
      completedTasksCount: 28,
      workloadPercentage: 60,
      bio: 'Model quantization, ONNX runtime deployment, and Bayesian workload capacity estimation.',
      skills: [{ name: 'PyTorch', level: 'expert' }, { name: 'Python', level: 'expert' }, { name: 'MLOps', level: 'proficient' }],
      teamIds: ['team-5']
    },
    {
      id: 'usr-14',
      name: 'Sunita Rao',
      email: 'sunita.rao@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Fullstack Integrations Engineer',
      department: 'Customer Solutions',
      status: 'online',
      statusMessage: 'Testing Jira and Slack webhook payloads',
      timezone: 'IST (UTC+5:30)',
      location: 'Lagos, Nigeria',
      joinedDate: '2024-02-01',
      lastActive: '4m ago',
      activeProjectsCount: 2,
      openTasksCount: 7,
      completedTasksCount: 45,
      workloadPercentage: 74,
      bio: 'Enterprise CRM/PSP integration pipelines, webhook dispatchers, and resilient retry queues.',
      skills: [{ name: 'Node.js', level: 'expert' }, { name: 'REST APIs', level: 'expert' }, { name: 'OAuth2', level: 'expert' }],
      teamIds: ['team-7']
    },
    {
      id: 'usr-15',
      name: 'Deepak Chawla',
      email: 'deepak.chawla@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Frontend Accessibility Lead',
      department: 'Design Systems',
      status: 'online',
      statusMessage: 'Testing screen-reader announcements',
      timezone: 'IST (UTC+5:30)',
      location: 'Bengaluru',
      joinedDate: '2023-11-15',
      lastActive: '10m ago',
      activeProjectsCount: 2,
      openTasksCount: 5,
      completedTasksCount: 51,
      workloadPercentage: 68,
      bio: 'Inclusive design, keyboard shortcuts, ARIA live regions, and high-contrast color standards.',
      skills: [{ name: 'WCAG 2.2', level: 'expert' }, { name: 'Angular', level: 'expert' }, { name: 'Screen Readers', level: 'expert' }],
      teamIds: ['team-2']
    },
    {
      id: 'usr-16',
      name: 'Manoj Nair',
      email: 'manoj.nair@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'Senior iOS Engineer',
      department: 'Mobile Experience',
      status: 'away',
      statusMessage: 'Coffee break',
      timezone: 'IST (UTC+5:30)',
      location: 'São Paulo, Brazil',
      joinedDate: '2024-03-12',
      lastActive: '20m ago',
      activeProjectsCount: 1,
      openTasksCount: 4,
      completedTasksCount: 29,
      workloadPercentage: 62,
      bio: 'SwiftUI, Combine, CoreData, and Apple Keychain secure biometric storage.',
      skills: [{ name: 'SwiftUI', level: 'expert' }, { name: 'Combine', level: 'expert' }],
      teamIds: ['team-4']
    },
    {
      id: 'usr-17',
      name: 'Ritu Agarwal',
      email: 'ritu.agarwal@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'QA Automation Lead',
      department: 'QA Automation',
      status: 'online',
      statusMessage: 'Executing end-to-end load tests in staging',
      timezone: 'IST (UTC+5:30)',
      location: 'Pune',
      joinedDate: '2023-07-22',
      lastActive: '6m ago',
      activeProjectsCount: 3,
      openTasksCount: 8,
      completedTasksCount: 78,
      workloadPercentage: 82,
      bio: 'Automated Playwright test suites, performance regression monitoring, and chaos engineering.',
      skills: [{ name: 'Playwright', level: 'expert' }, { name: 'k6 Load Testing', level: 'expert' }, { name: 'CI/CD Pipelines', level: 'expert' }],
      teamIds: ['team-8']
    },
    {
      id: 'usr-18',
      name: 'Karthik Swaminathan',
      email: 'karthik.swaminathan@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      role: 'developer',
      roleTitle: 'DevOps & Reliability Engineer',
      department: 'Cloud & Infrastructure',
      status: 'online',
      statusMessage: 'Upgrading ArgoCD cluster helm charts',
      timezone: 'IST (UTC+5:30)',
      location: 'Atlanta, GA',
      joinedDate: '2023-12-01',
      lastActive: '1m ago',
      activeProjectsCount: 3,
      openTasksCount: 6,
      completedTasksCount: 55,
      workloadPercentage: 76,
      bio: 'GitOps with ArgoCD, Helm, Prometheus monitoring, and automated canary rollouts.',
      skills: [{ name: 'Kubernetes', level: 'expert' }, { name: 'ArgoCD', level: 'expert' }, { name: 'Prometheus', level: 'proficient' }],
      teamIds: ['team-3']
    },
    {
      id: 'usr-19',
      name: 'Meera Banerjee',
      email: 'meera.banerjee@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      role: 'employee',
      roleTitle: 'Product Operations Analyst',
      department: 'Customer Solutions',
      status: 'busy',
      statusMessage: 'Analyzing Q3 customer SLA tickets',
      timezone: 'IST (UTC+5:30)',
      location: 'Cairo, Egypt',
      joinedDate: '2024-06-15',
      lastActive: '18m ago',
      activeProjectsCount: 2,
      openTasksCount: 5,
      completedTasksCount: 22,
      workloadPercentage: 66,
      bio: 'Operational telemetry, customer satisfaction metrics, and enterprise pilot onboarding.',
      skills: [{ name: 'Product Analytics', level: 'expert' }, { name: 'SQL', level: 'proficient' }],
      teamIds: ['team-7']
    },
    {
      id: 'usr-20',
      name: 'Harish Venkataraman',
      email: 'harish.venkataraman@vertex.enterprise',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      role: 'viewer',
      roleTitle: 'VP of Technology & Enterprise Strategy',
      department: 'Executive Leadership',
      status: 'online',
      statusMessage: 'Board Meeting Prep',
      timezone: 'IST (UTC+5:30)',
      location: 'Mumbai',
      joinedDate: '2022-05-01',
      lastActive: '30m ago',
      activeProjectsCount: 6,
      openTasksCount: 2,
      completedTasksCount: 40,
      workloadPercentage: 45,
      bio: 'Executive sponsor overseeing enterprise architecture, corporate compliance, and capital budget allocation.',
      skills: [{ name: 'Executive Strategy', level: 'expert' }, { name: 'Technology Governance', level: 'expert' }],
      teamIds: ['team-1']
    }
  ]);

  // Teams Signal (8 Teams)
  public teams = signal<Team[]>([
    {
      id: 'team-1',
      name: 'Core Platform Architecture',
      code: 'CORE',
      description: 'Distributed services, API gateway, consensus layer, and fundamental backend infrastructure.',
      department: 'Engineering',
      leadId: 'usr-1',
      leadName: 'Ananya Iyer',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-1', 'usr-5', 'usr-20'],
      activeProjectIds: ['proj-1', 'proj-6'],
      productivityScore: 94,
      averageWorkload: 81,
      color: '#10B981', // Emerald
      tags: ['Backend', 'Infrastructure', 'GraphQL', 'Rust']
    },
    {
      id: 'team-2',
      name: 'Design Systems & UX Foundations',
      code: 'DSUX',
      description: 'Pioneering accessible, graphite-first visual standards, interactive components, and token automation.',
      department: 'Product & Design',
      leadId: 'usr-3',
      leadName: 'Pooja Sundaram',
      leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-3', 'usr-6', 'usr-9', 'usr-15'],
      activeProjectIds: ['proj-2'],
      productivityScore: 96,
      averageWorkload: 76,
      color: '#F59E0B', // Amber
      tags: ['Figma', 'SCSS', 'Tokens', 'WCAG']
    },
    {
      id: 'team-3',
      name: 'Cloud & Infrastructure SRE',
      code: 'SRE',
      description: 'Multi-region Kubernetes management, cloud networking, telemetry collectors, and zero-downtime database sharding.',
      department: 'Infrastructure',
      leadId: 'usr-12',
      leadName: 'Priya Sharma',
      leadAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-1', 'usr-12', 'usr-18'],
      activeProjectIds: ['proj-1', 'proj-9'],
      productivityScore: 89,
      averageWorkload: 85,
      color: '#8B5CF6', // Muted Purple
      tags: ['Kubernetes', 'SRE', 'PostgreSQL', 'Terraform']
    },
    {
      id: 'team-4',
      name: 'Mobile Experience (iOS / Android)',
      code: 'MOBI',
      description: 'Enterprise companion apps with offline CRDT syncing, biometric security, and push workflows.',
      department: 'Engineering',
      leadId: 'usr-8',
      leadName: 'Rajesh Sengupta',
      leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-8', 'usr-10', 'usr-16'],
      activeProjectIds: ['proj-5'],
      productivityScore: 88,
      averageWorkload: 73,
      color: '#EA580C', // Orange
      tags: ['iOS', 'Android', 'OfflineSync', 'Biometrics']
    },
    {
      id: 'team-5',
      name: 'Data Intelligence & Predictive ML',
      code: 'DATA',
      description: 'High-throughput Kafka streaming, ClickHouse time-series, and capacity estimation inference.',
      department: 'Data & Analytics',
      leadId: 'usr-2',
      leadName: 'Rohan Deshmukh',
      leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-2', 'usr-7', 'usr-13'],
      activeProjectIds: ['proj-4', 'proj-8'],
      productivityScore: 92,
      averageWorkload: 69,
      color: '#10B981', // Emerald
      tags: ['Kafka', 'ClickHouse', 'MachineLearning', 'Analytics']
    },
    {
      id: 'team-6',
      name: 'Enterprise Security & Governance',
      code: 'SECG',
      description: 'Zero-trust architecture, WebAuthn passwordless authentication, SOC2/ISO audit defense, and cryptographic seals.',
      department: 'Security & Legal',
      leadId: 'usr-4',
      leadName: 'Vikram Malhotra',
      leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-4', 'usr-11'],
      activeProjectIds: ['proj-3', 'proj-7', 'proj-11'],
      productivityScore: 91,
      averageWorkload: 80,
      color: '#DC2626', // Crimson
      tags: ['ZeroTrust', 'SOC2', 'SAML', 'Compliance']
    },
    {
      id: 'team-7',
      name: 'Customer Solutions & Integrations',
      code: 'CUST',
      description: 'Partner API gateways, enterprise webhook relays, Jira/Slack/GitHub bi-directional sync adapters.',
      department: 'Solutions',
      leadId: 'usr-14',
      leadName: 'Sunita Rao',
      leadAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-5', 'usr-14', 'usr-19'],
      activeProjectIds: ['proj-10'],
      productivityScore: 87,
      averageWorkload: 71,
      color: '#EAB308', // Gold
      tags: ['Integrations', 'Webhooks', 'PartnerEcosystem']
    },
    {
      id: 'team-8',
      name: 'QA Automation & Chaos Resilience',
      code: 'QA',
      description: 'Synthetic user journeys, load injection, chaos engineering, and continuous deployment validation gates.',
      department: 'Quality Engineering',
      leadId: 'usr-17',
      leadName: 'Ritu Agarwal',
      leadAvatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
      memberIds: ['usr-17'],
      activeProjectIds: ['proj-1', 'proj-2', 'proj-4'],
      productivityScore: 93,
      averageWorkload: 82,
      color: '#059669', // Deep Emerald
      tags: ['Playwright', 'ChaosEngineering', 'LoadTesting']
    }
  ]);

  // Tasks Signal (55+ realistic tasks)
  public tasks = signal<Task[]>([
    {
      id: 'tsk-101',
      key: 'ORB-101-1',
      title: 'Configure Istio Service Mesh Mutual TLS with Spiffe/Spire',
      description: 'Implement automated SPIFFE ID issuance for zero-trust microservice communication across US-East and EU-West clusters with strict mTLS enforcement.',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      projectKey: 'ORB-101',
      assigneeId: 'usr-1',
      assigneeName: 'Ananya Iyer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Principal Solutions Architect',
      reporterId: 'usr-12',
      reporterName: 'Priya Sharma',
      reporterAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'in_progress',
      startDate: '2026-11-01',
      dueDate: '2026-11-12',
      tags: ['Security', 'mTLS', 'Kubernetes'],
      estimatedHours: 24,
      actualHours: 16,
      createdAt: '2026-10-28T09:00:00Z',
      updatedAt: '2026-11-05T08:00:00Z',
      subtasks: [
        { id: 'sub-1', title: 'Generate Spire server daemonsets in Helm', completed: true },
        { id: 'sub-2', title: 'Test cert rotation under 30s threshold', completed: true },
        { id: 'sub-3', title: 'Validate packet capture mTLS verification', completed: false }
      ],
      attachments: [
        { id: 'att-1', name: 'spiffe-architecture-spec.pdf', size: '2.4 MB', type: 'pdf', uploadedAt: '2026-10-29', url: '#' }
      ],
      comments: [
        {
          id: 'c-1',
          authorId: 'usr-12',
          authorName: 'Priya Sharma',
          authorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
          authorRole: 'Principal Database Reliability Engineer',
          content: 'Verified that the certificate authority handoff does not impact live PostgreSQL connection pooling.',
          createdAt: '2026-11-04T14:32:00Z'
        }
      ],
      history: [
        { id: 'h-1', actorName: 'Ananya Iyer', actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', action: 'Changed status from Todo to In Progress', timestamp: '2026-11-01T10:15:00Z' }
      ]
    },
    {
      id: 'tsk-102',
      key: 'ORB-101-2',
      title: 'Automated cross-region DNS failover drill via Route53 Health Checks',
      description: 'Simulate complete US-East-1 datacenter blackhole and verify automatic 8-second DNS failover to EU-Central-1 without connection reset.',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      projectKey: 'ORB-101',
      assigneeId: 'usr-18',
      assigneeName: 'Karthik Swaminathan',
      assigneeAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'DevOps & Reliability Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'todo',
      startDate: '2026-11-10',
      dueDate: '2026-11-20',
      tags: ['SRE', 'Failover', 'DNS'],
      estimatedHours: 16,
      actualHours: 0,
      createdAt: '2026-11-02T11:00:00Z',
      updatedAt: '2026-11-02T11:00:00Z',
      subtasks: [
        { id: 'sub-4', title: 'Prepare canary synthetic load generator script', completed: false },
        { id: 'sub-5', title: 'Execute chaos injection test in staging', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-103',
      key: 'ORB-101-3',
      title: 'Benchmark Kubernetes node provisioning latency with Karpenter',
      description: 'Replace standard Cluster Autoscaler with Karpenter for just-in-time EC2 node launches. Target node provisioning in under 45 seconds.',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      projectKey: 'ORB-101',
      assigneeId: 'usr-18',
      assigneeName: 'Karthik Swaminathan',
      assigneeAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'DevOps & Reliability Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'medium',
      status: 'completed',
      startDate: '2026-10-15',
      dueDate: '2026-10-28',
      tags: ['Kubernetes', 'Karpenter', 'CostOptimization'],
      estimatedHours: 20,
      actualHours: 18,
      createdAt: '2026-10-12T08:00:00Z',
      updatedAt: '2026-10-28T16:00:00Z',
      subtasks: [
        { id: 'sub-6', title: 'Deploy Karpenter v0.35 in sandbox', completed: true },
        { id: 'sub-7', title: 'Tune NodePool constraints for spot instances', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-201',
      key: 'ORB-202-1',
      title: 'Graphite Theme Variable Engine & SCSS Tokens Spec',
      description: 'Build SCSS CSS custom properties architecture supporting dynamic theme switching without page reload, guaranteeing zero corporate blue leakage.',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      projectKey: 'ORB-202',
      assigneeId: 'usr-3',
      assigneeName: 'Pooja Sundaram',
      assigneeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Staff Design Systems Architect',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'completed',
      startDate: '2026-08-01',
      dueDate: '2026-08-20',
      tags: ['DesignSystem', 'SCSS', 'Tokens'],
      estimatedHours: 32,
      actualHours: 30,
      createdAt: '2026-07-28T10:00:00Z',
      updatedAt: '2026-08-20T17:00:00Z',
      subtasks: [
        { id: 'sub-8', title: 'Define charcoal and graphite base palette', completed: true },
        { id: 'sub-9', title: 'Establish emerald and amber accent guidelines', completed: true },
        { id: 'sub-10', title: 'Audit all UI components against hex color rules', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-202',
      key: 'ORB-202-2',
      title: 'Interactive High-Density Data Grid with Column Pinning',
      description: 'Implement virtualized data table component capable of rendering 10,000+ rows with column sorting, filtering, selection, and multi-column freeze.',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      projectKey: 'ORB-202',
      assigneeId: 'usr-6',
      assigneeName: 'Devendra Verma',
      assigneeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Senior Frontend Engineer',
      reporterId: 'usr-3',
      reporterName: 'Pooja Sundaram',
      reporterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-10-25',
      dueDate: '2026-11-15',
      tags: ['Angular', 'DataTable', 'Performance'],
      estimatedHours: 40,
      actualHours: 26,
      createdAt: '2026-10-20T14:00:00Z',
      updatedAt: '2026-11-05T09:30:00Z',
      subtasks: [
        { id: 'sub-11', title: 'Implement CDK virtual scroll viewport', completed: true },
        { id: 'sub-12', title: 'Add keyboard arrow cell navigation', completed: true },
        { id: 'sub-13', title: 'Ensure WCAG table markup aria-sort', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-203',
      key: 'ORB-202-3',
      title: 'WCAG 2.2 AAA Contrast Audit for Dark Graphite Palettes',
      description: 'Verify 7:1 contrast ratios on small text across deep black surfaces (#111111) with muted graphite borders (#262626) and emerald badges.',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      projectKey: 'ORB-202',
      assigneeId: 'usr-15',
      assigneeName: 'Deepak Chawla',
      assigneeAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Frontend Accessibility Lead',
      reporterId: 'usr-3',
      reporterName: 'Pooja Sundaram',
      reporterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      priority: 'medium',
      status: 'review',
      startDate: '2026-11-01',
      dueDate: '2026-11-08',
      tags: ['Accessibility', 'WCAG', 'Audit'],
      estimatedHours: 16,
      actualHours: 14,
      createdAt: '2026-10-30T10:00:00Z',
      updatedAt: '2026-11-05T07:15:00Z',
      subtasks: [
        { id: 'sub-14', title: 'Audit primary text against #171717 background', completed: true },
        { id: 'sub-15', title: 'Fix subtle grey placeholder contrast in input fields', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-301',
      key: 'ORB-303-1',
      title: 'Integrate FIDO2 WebAuthn Passwordless Credential Registration',
      description: 'Support YubiKey and Apple TouchID / Windows Hello hardware keys with challenge-response signature verification via elliptic curves.',
      projectId: 'proj-3',
      projectName: 'Zero-Trust Enterprise Auth & RBAC Matrix',
      projectKey: 'ORB-303',
      assigneeId: 'usr-4',
      assigneeName: 'Vikram Malhotra',
      assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Head of Enterprise Security & Trust',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'completed',
      startDate: '2026-09-05',
      dueDate: '2026-10-01',
      tags: ['Security', 'WebAuthn', 'FIDO2'],
      estimatedHours: 35,
      actualHours: 32,
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-10-01T17:00:00Z',
      subtasks: [
        { id: 'sub-16', title: 'Implement navigator.credentials.create wrapper', completed: true },
        { id: 'sub-17', title: 'Verify ES256/RS256 signature algorithm support', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-302',
      key: 'ORB-303-2',
      title: 'Multi-Tenant SAML 2.0 Identity Provider Federation with Okta',
      description: 'Implement automated SP metadata generator and dynamic attribute mapping for Okta enterprise single sign-on.',
      projectId: 'proj-3',
      projectName: 'Zero-Trust Enterprise Auth & RBAC Matrix',
      projectKey: 'ORB-303',
      assigneeId: 'usr-11',
      assigneeName: 'Siddharth Joshi',
      assigneeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'SecOps & Compliance Specialist',
      reporterId: 'usr-4',
      reporterName: 'Vikram Malhotra',
      reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'blocked',
      startDate: '2026-10-15',
      dueDate: '2026-11-10',
      tags: ['SAML', 'SSO', 'Okta'],
      estimatedHours: 28,
      actualHours: 18,
      blockedReason: 'Awaiting updated X.509 signing certificates from Okta sandbox environment.',
      createdAt: '2026-10-12T09:00:00Z',
      updatedAt: '2026-11-04T16:00:00Z',
      subtasks: [
        { id: 'sub-18', title: 'Parse XML SAML Assertion with xmlsec', completed: true },
        { id: 'sub-19', title: 'Verify replay attack timestamp window', completed: false }
      ],
      attachments: [],
      comments: [
        {
          id: 'c-32',
          authorId: 'usr-4',
          authorName: 'Vikram Malhotra',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          authorRole: 'Head of Enterprise Security & Trust',
          content: 'Escalated with the vendor identity team. Expected certificate delivery tomorrow 10:00 AM IST.',
          createdAt: '2026-11-04T16:15:00Z'
        }
      ],
      history: []
    },
    {
      id: 'tsk-401',
      key: 'ORB-404-1',
      title: 'Kafka Ingestion Pipeline for Real-time Audit Events',
      description: 'Deploy 6-partition Kafka broker cluster with Snappy compression and min.insync.replicas=2 for 99.999% audit durability.',
      projectId: 'proj-4',
      projectName: 'Real-Time Telemetry & Event Analytics Engine',
      projectKey: 'ORB-404',
      assigneeId: 'usr-2',
      assigneeName: 'Rohan Deshmukh',
      assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Director of Data Intelligence',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'completed',
      startDate: '2026-08-01',
      dueDate: '2026-08-25',
      tags: ['Kafka', 'Streaming', 'DataPipeline'],
      estimatedHours: 30,
      actualHours: 28,
      createdAt: '2026-07-25T10:00:00Z',
      updatedAt: '2026-08-25T18:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-402',
      key: 'ORB-404-2',
      title: 'ClickHouse Columnar Aggregation Table for Task Analytics',
      description: 'Design ReplacingMergeTree table schemas for fast rollup computation over 250 million historical task state changes.',
      projectId: 'proj-4',
      projectName: 'Real-Time Telemetry & Event Analytics Engine',
      projectKey: 'ORB-404',
      assigneeId: 'usr-7',
      assigneeName: 'Kavita Krishnan',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Senior Data Engineer',
      reporterId: 'usr-2',
      reporterName: 'Rohan Deshmukh',
      reporterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-10-20',
      dueDate: '2026-11-18',
      tags: ['ClickHouse', 'SQL', 'BigData'],
      estimatedHours: 25,
      actualHours: 15,
      createdAt: '2026-10-18T11:00:00Z',
      updatedAt: '2026-11-04T12:00:00Z',
      subtasks: [
        { id: 'sub-20', title: 'Benchmark ZSTD vs LZ4 compression ratio', completed: true },
        { id: 'sub-21', title: 'Implement continuous materialized view query', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-501',
      key: 'ORB-505-1',
      title: 'CRDT SQLite Conflict Resolution Engine for Mobile Offline Mode',
      description: 'Implement Yjs / Automerge state-vector syncing over WebSockets when device reconnects to enterprise Wi-Fi or cellular network.',
      projectId: 'proj-5',
      projectName: 'Native iOS & Android Mobile Suite v4.0',
      projectKey: 'ORB-505',
      assigneeId: 'usr-8',
      assigneeName: 'Rajesh Sengupta',
      assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Lead Mobile Architect',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'in_progress',
      startDate: '2026-10-05',
      dueDate: '2026-11-20',
      tags: ['Mobile', 'CRDT', 'OfflineSync'],
      estimatedHours: 45,
      actualHours: 28,
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: '2026-11-04T15:00:00Z',
      subtasks: [
        { id: 'sub-22', title: 'Write SQLite differential state delta schema', completed: true },
        { id: 'sub-23', title: 'Test 3-way concurrent edit merge conflict', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-502',
      key: 'ORB-505-2',
      title: 'Android Compose Fluid Navigation Transitions & Gesture Anchors',
      description: 'Smooth bottom sheet dismiss physics and shared element transitions matching the desktop design token specification.',
      projectId: 'proj-5',
      projectName: 'Native iOS & Android Mobile Suite v4.0',
      projectKey: 'ORB-505',
      assigneeId: 'usr-10',
      assigneeName: 'Vikram Mehta',
      assigneeAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Senior Mobile Engineer (Android)',
      reporterId: 'usr-8',
      reporterName: 'Rajesh Sengupta',
      reporterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      priority: 'medium',
      status: 'in_progress',
      startDate: '2026-10-25',
      dueDate: '2026-11-15',
      tags: ['Android', 'Compose', 'Gestures'],
      estimatedHours: 22,
      actualHours: 12,
      createdAt: '2026-10-22T08:30:00Z',
      updatedAt: '2026-11-04T10:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-601',
      key: 'ORB-606-1',
      title: 'Deploy Apollo Router Rust Binary with Subgraph Invalidation',
      description: 'Setup stateless Docker cluster running Apollo Router with Redis-backed query response caching and JWT claims passthrough.',
      projectId: 'proj-6',
      projectName: 'Unified GraphQL Federation Gateway',
      projectKey: 'ORB-606',
      assigneeId: 'usr-5',
      assigneeName: 'Arjun Nambiar',
      assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Staff Backend & API Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'completed',
      startDate: '2026-06-01',
      dueDate: '2026-06-30',
      tags: ['GraphQL', 'Rust', 'Apollo'],
      estimatedHours: 40,
      actualHours: 36,
      createdAt: '2026-05-25T09:00:00Z',
      updatedAt: '2026-06-30T17:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-701',
      key: 'ORB-707-1',
      title: 'Automated AWS IAM Role Drift Detector and GitHub Secret Scanner',
      description: 'Continuous background scanner reporting IAM policies violating least-privilege standards and detecting committed credentials in real-time.',
      projectId: 'proj-7',
      projectName: 'Automated Continuous Compliance & Audit Hub',
      projectKey: 'ORB-707',
      assigneeId: 'usr-11',
      assigneeName: 'Siddharth Joshi',
      assigneeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'SecOps & Compliance Specialist',
      reporterId: 'usr-4',
      reporterName: 'Vikram Malhotra',
      reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'todo',
      startDate: '2026-11-15',
      dueDate: '2026-12-15',
      tags: ['Security', 'AWS', 'Compliance'],
      estimatedHours: 28,
      actualHours: 0,
      createdAt: '2026-11-02T13:00:00Z',
      updatedAt: '2026-11-02T13:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-801',
      key: 'ORB-808-1',
      title: 'Feature Engineering for Task Completion Velocity Heuristic',
      description: 'Extract statistical features: ticket churn rate, reviewer comment density, assignee historical velocity, and component cyclomatic complexity.',
      projectId: 'proj-8',
      projectName: 'AI-Powered Predictive Workload & Resource Allocator',
      projectKey: 'ORB-808',
      assigneeId: 'usr-13',
      assigneeName: 'Aditya Kulkarni',
      assigneeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Machine Learning Engineer',
      reporterId: 'usr-2',
      reporterName: 'Rohan Deshmukh',
      reporterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'completed',
      startDate: '2026-08-10',
      dueDate: '2026-09-15',
      tags: ['MachineLearning', 'Python', 'FeatureEngineering'],
      estimatedHours: 35,
      actualHours: 34,
      createdAt: '2026-08-01T09:00:00Z',
      updatedAt: '2026-09-15T18:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-802',
      key: 'ORB-808-2',
      title: 'Inference Microservice with gRPC Endpoint for Realtime Scheduling',
      description: 'Deploy containerized TorchServe model endpoint responding to project manager rebalancing events within 80ms p99 latency.',
      projectId: 'proj-8',
      projectName: 'AI-Powered Predictive Workload & Resource Allocator',
      projectKey: 'ORB-808',
      assigneeId: 'usr-13',
      assigneeName: 'Aditya Kulkarni',
      assigneeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Machine Learning Engineer',
      reporterId: 'usr-2',
      reporterName: 'Rohan Deshmukh',
      reporterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-10-15',
      dueDate: '2026-11-20',
      tags: ['gRPC', 'TorchServe', 'Performance'],
      estimatedHours: 30,
      actualHours: 18,
      createdAt: '2026-10-10T11:00:00Z',
      updatedAt: '2026-11-04T16:00:00Z',
      subtasks: [
        { id: 'sub-24', title: 'Write proto3 contract for allocation service', completed: true },
        { id: 'sub-25', title: 'Load test endpoint up to 150 concurrent req/sec', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-901',
      key: 'ORB-909-1',
      title: 'Evaluate Citus vs Native Declarative Partitioning on PostgreSQL 16',
      description: 'Stress test 500M row workload across 8 worker nodes measuring query planner overhead and foreign key reference speed.',
      projectId: 'proj-9',
      projectName: 'Legacy Monolith Database Sharding & Partitioning',
      projectKey: 'ORB-909',
      assigneeId: 'usr-12',
      assigneeName: 'Priya Sharma',
      assigneeAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Principal Database Reliability Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'completed',
      startDate: '2026-06-01',
      dueDate: '2026-07-20',
      tags: ['PostgreSQL', 'Sharding', 'Benchmarks'],
      estimatedHours: 40,
      actualHours: 38,
      createdAt: '2026-05-20T08:00:00Z',
      updatedAt: '2026-07-20T17:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-1001',
      key: 'ORB-010-1',
      title: 'Publish OpenAPI 3.1 Contract and TypeScript SDK Generator',
      description: 'Automate build pipeline releasing `@vertex/sdk` npm package with full TypeScript types, auto-retries, and HMAC request signing.',
      projectId: 'proj-10',
      projectName: 'Ecosystem Developer Platform & Public REST/Webhook API v2',
      projectKey: 'ORB-010',
      assigneeId: 'usr-14',
      assigneeName: 'Sunita Rao',
      assigneeAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Fullstack Integrations Engineer',
      reporterId: 'usr-5',
      reporterName: 'Arjun Nambiar',
      reporterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      priority: 'medium',
      status: 'review',
      startDate: '2026-10-10',
      dueDate: '2026-11-10',
      tags: ['OpenAPI', 'SDK', 'TypeScript'],
      estimatedHours: 24,
      actualHours: 22,
      createdAt: '2026-10-05T09:00:00Z',
      updatedAt: '2026-11-04T15:00:00Z',
      subtasks: [
        { id: 'sub-26', title: 'Generate typed interfaces from OpenAPI JSON', completed: true },
        { id: 'sub-27', title: 'Write integration test against mock HTTP server', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-1002',
      key: 'ORB-010-2',
      title: 'Cryptographic Webhook Signature Verification and Replay Prevention',
      description: 'Implement HMAC-SHA256 signature headers with timestamp nonce verification preventing duplicate event processing for enterprise webhook subscribers.',
      projectId: 'proj-10',
      projectName: 'Ecosystem Developer Platform & Public REST/Webhook API v2',
      projectKey: 'ORB-010',
      assigneeId: 'usr-5',
      assigneeName: 'Arjun Nambiar',
      assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Staff Backend & API Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-10-28',
      dueDate: '2026-11-18',
      tags: ['Webhooks', 'Security', 'HMAC'],
      estimatedHours: 18,
      actualHours: 10,
      createdAt: '2026-10-25T11:00:00Z',
      updatedAt: '2026-11-05T08:45:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-104',
      key: 'ORB-101-4',
      title: 'Prometheus & Grafana Enterprise Telemetry Dashboards',
      description: 'Deploy custom dashboards visualizing Kubernetes node pressure, Pod eviction rates, ingress latency percentiles (p50, p95, p99), and egress bandwidth.',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      projectKey: 'ORB-101',
      assigneeId: 'usr-18',
      assigneeName: 'Karthik Swaminathan',
      assigneeAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'DevOps & Reliability Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'medium',
      status: 'backlog',
      startDate: '2026-11-20',
      dueDate: '2026-12-05',
      tags: ['Prometheus', 'Grafana', 'Monitoring'],
      estimatedHours: 20,
      actualHours: 0,
      createdAt: '2026-11-01T14:00:00Z',
      updatedAt: '2026-11-01T14:00:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-204',
      key: 'ORB-202-4',
      title: 'Enterprise Command Palette (Ctrl+K) Fuzzy Search Algorithm',
      description: 'Implement fast Trie and Levenshtein distance scoring for navigating projects, tasks, members, and documents with keyboard up/down arrows.',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      projectKey: 'ORB-202',
      assigneeId: 'usr-6',
      assigneeName: 'Devendra Verma',
      assigneeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Senior Frontend Engineer',
      reporterId: 'usr-3',
      reporterName: 'Pooja Sundaram',
      reporterAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      priority: 'critical',
      status: 'in_progress',
      startDate: '2026-11-01',
      dueDate: '2026-11-10',
      tags: ['CommandPalette', 'UX', 'KeyboardNavigation'],
      estimatedHours: 18,
      actualHours: 12,
      createdAt: '2026-10-29T10:00:00Z',
      updatedAt: '2026-11-05T09:00:00Z',
      subtasks: [
        { id: 'sub-28', title: 'Bind global Ctrl+K and Cmd+K listener', completed: true },
        { id: 'sub-29', title: 'Add grouped search sections with badge counters', completed: true },
        { id: 'sub-30', title: 'Handle empty result and keyboard escape trap', completed: false }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-205',
      key: 'ORB-202-5',
      title: 'Kanban Column Physics with Smooth Drag and Drop State Management',
      description: 'Hardware-accelerated CSS transforms during card grab, dynamic drop placeholder indicator, and optimistic status updates with undo capability.',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      projectKey: 'ORB-202',
      assigneeId: 'usr-6',
      assigneeName: 'Devendra Verma',
      assigneeAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Senior Frontend Engineer',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'review',
      startDate: '2026-10-20',
      dueDate: '2026-11-06',
      tags: ['Kanban', 'DragDrop', 'Animations'],
      estimatedHours: 24,
      actualHours: 22,
      createdAt: '2026-10-18T12:00:00Z',
      updatedAt: '2026-11-04T17:00:00Z',
      subtasks: [
        { id: 'sub-31', title: 'Implement HTML5 dragstart and dragover handlers', completed: true },
        { id: 'sub-32', title: 'Add smooth scale(1.02) card pickup transition', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-303',
      key: 'ORB-303-3',
      title: 'Granular Role Permission Evaluation Engine',
      description: 'Implement dynamic matrix evaluator checking user role against requested resource domain (Projects, Tasks, Financials, Audit Logs) and action.',
      projectId: 'proj-3',
      projectName: 'Zero-Trust Enterprise Auth & RBAC Matrix',
      projectKey: 'ORB-303',
      assigneeId: 'usr-4',
      assigneeName: 'Vikram Malhotra',
      assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Head of Enterprise Security & Trust',
      reporterId: 'usr-1',
      reporterName: 'Ananya Iyer',
      reporterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-10-28',
      dueDate: '2026-11-15',
      tags: ['RBAC', 'Permissions', 'Security'],
      estimatedHours: 22,
      actualHours: 14,
      createdAt: '2026-10-24T09:00:00Z',
      updatedAt: '2026-11-05T07:45:00Z',
      subtasks: [],
      attachments: [],
      comments: [],
      history: []
    },
    {
      id: 'tsk-803',
      key: 'ORB-808-3',
      title: 'Heatmap Visualization for Team Capacity and Workload Bottlenecks',
      description: 'Interactive resource scheduling matrix showing weekly capacity vs assigned hours per engineer, warning when utilization exceeds 90%.',
      projectId: 'proj-8',
      projectName: 'AI-Powered Predictive Workload & Resource Allocator',
      projectKey: 'ORB-808',
      assigneeId: 'usr-1',
      assigneeName: 'Ananya Iyer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      assigneeRole: 'Principal Solutions Architect',
      reporterId: 'usr-2',
      reporterName: 'Rohan Deshmukh',
      reporterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      priority: 'high',
      status: 'in_progress',
      startDate: '2026-11-02',
      dueDate: '2026-11-14',
      tags: ['Workload', 'ResourceHeatmap', 'Analytics'],
      estimatedHours: 20,
      actualHours: 11,
      createdAt: '2026-10-31T08:00:00Z',
      updatedAt: '2026-11-05T10:00:00Z',
      subtasks: [
        { id: 'sub-33', title: 'Generate daily allocation grid', completed: true },
        { id: 'sub-34', title: 'Add amber and vermilion threshold alert badges', completed: true }
      ],
      attachments: [],
      comments: [],
      history: []
    }
  ]);

  // Calendar Events Signal (20+ Events)
  public events = signal<CalendarEvent[]>([
    {
      id: 'evt-1',
      title: 'Architecture Review: Multi-Region Istio Failover',
      description: 'Review drill architecture and verify traffic mirroring safeguards.',
      type: 'review',
      startDate: '2026-11-06T10:00:00',
      endDate: '2026-11-06T11:30:00',
      allDay: false,
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      teamId: 'team-3',
      attendeeIds: ['usr-1', 'usr-12', 'usr-18'],
      location: 'Executive Boardroom A & Zoom',
      color: '#10B981'
    },
    {
      id: 'evt-2',
      title: 'Design System 3.0 Token Freeze & Review',
      description: 'Final sign-off on Graphite theme color tokens and WCAG AAA compliance checks.',
      type: 'review',
      startDate: '2026-11-07T14:00:00',
      endDate: '2026-11-07T15:30:00',
      allDay: false,
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      teamId: 'team-2',
      attendeeIds: ['usr-3', 'usr-6', 'usr-9', 'usr-15'],
      location: 'Design Studio & Virtual',
      color: '#F59E0B'
    },
    {
      id: 'evt-3',
      title: 'Q4 Enterprise OKR Alignment & Sprint Planning',
      description: 'Departmental alignment on Q4 strategic deliverables and budget status.',
      type: 'meeting',
      startDate: '2026-11-09T09:00:00',
      endDate: '2026-11-09T10:30:00',
      allDay: false,
      teamId: 'team-1',
      attendeeIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-20'],
      location: 'Main Auditorium / Global Stream',
      color: '#8B5CF6'
    },
    {
      id: 'evt-4',
      title: 'SOC2 Type II External Auditor Checkpoint',
      description: 'Present evidence logs and WebAuthn access control verification.',
      type: 'deadline',
      startDate: '2026-11-10T13:00:00',
      endDate: '2026-11-10T15:00:00',
      allDay: false,
      projectId: 'proj-3',
      projectName: 'Zero-Trust Enterprise Auth & RBAC Matrix',
      teamId: 'team-6',
      attendeeIds: ['usr-4', 'usr-11', 'usr-1'],
      location: 'Security Operations Center',
      color: '#DC2626'
    },
    {
      id: 'evt-5',
      title: 'Mobile v4.0 TestFlight Build Cut',
      description: 'Tag and sign iOS v4.0 release candidate for internal dogfooding.',
      type: 'release',
      startDate: '2026-11-12T16:00:00',
      endDate: '2026-11-12T17:00:00',
      allDay: false,
      projectId: 'proj-5',
      projectName: 'Native iOS & Android Mobile Suite v4.0',
      teamId: 'team-4',
      attendeeIds: ['usr-8', 'usr-10', 'usr-16'],
      color: '#EA580C'
    },
    {
      id: 'evt-6',
      title: 'Data Intelligence Weekly Stream Benchmarking',
      description: 'Analyze ClickHouse query execution times and Kafka consumer lag.',
      type: 'workshop',
      startDate: '2026-11-13T11:00:00',
      endDate: '2026-11-13T12:00:00',
      allDay: false,
      projectId: 'proj-4',
      projectName: 'Real-Time Telemetry & Event Analytics Engine',
      teamId: 'team-5',
      attendeeIds: ['usr-2', 'usr-7', 'usr-13'],
      color: '#10B981'
    },
    {
      id: 'evt-7',
      title: 'Executive Steering Committee Milestone Signoff',
      description: 'Present Q4 project health, budget utilization, and risk register.',
      type: 'milestone',
      startDate: '2026-11-16T15:00:00',
      endDate: '2026-11-16T16:30:00',
      allDay: false,
      attendeeIds: ['usr-1', 'usr-20', 'usr-4'],
      color: '#EAB308'
    }
  ]);

  // Activity Feed Signal (30+ realistic events)
  public activities = signal<Activity[]>([
    {
      id: 'act-1',
      actorId: 'usr-1',
      actorName: 'Ananya Iyer',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      action: 'completed',
      targetType: 'task',
      targetId: 'tsk-103',
      targetTitle: 'Benchmark Kubernetes node provisioning latency with Karpenter',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      details: 'Reduced node spawn latency from 140s to 38s in test benchmarks.',
      timestamp: '2026-11-05T09:42:00Z'
    },
    {
      id: 'act-2',
      actorId: 'usr-3',
      actorName: 'Pooja Sundaram',
      actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      action: 'updated',
      targetType: 'project',
      targetId: 'proj-2',
      targetTitle: 'Design System 3.0: Graphite & Carbon Foundations',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      details: 'Updated project progress to 82% and added WCAG audit milestone results.',
      timestamp: '2026-11-05T09:15:00Z'
    },
    {
      id: 'act-3',
      actorId: 'usr-4',
      actorName: 'Vikram Malhotra',
      actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      action: 'commented',
      targetType: 'task',
      targetId: 'tsk-302',
      targetTitle: 'Multi-Tenant SAML 2.0 Identity Provider Federation with Okta',
      projectId: 'proj-3',
      projectName: 'Zero-Trust Enterprise Auth & RBAC Matrix',
      details: 'Escalated certificate signing timeline with vendor security ops.',
      timestamp: '2026-11-05T08:30:00Z'
    },
    {
      id: 'act-4',
      actorId: 'usr-6',
      actorName: 'Devendra Verma',
      actorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      action: 'status_change',
      targetType: 'task',
      targetId: 'tsk-205',
      targetTitle: 'Kanban Column Physics with Smooth Drag and Drop State Management',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      details: 'Moved from In Progress to Review.',
      timestamp: '2026-11-05T07:10:00Z'
    },
    {
      id: 'act-5',
      actorId: 'usr-12',
      actorName: 'Priya Sharma',
      actorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      action: 'created',
      targetType: 'document',
      targetId: 'doc-1',
      targetTitle: 'RFC-409: Citus Distributed Table Strategy',
      projectId: 'proj-9',
      projectName: 'Legacy Monolith Database Sharding & Partitioning',
      details: 'Uploaded technical design document with sharding key benchmark comparisons.',
      timestamp: '2026-11-04T18:22:00Z'
    },
    {
      id: 'act-6',
      actorId: 'usr-2',
      actorName: 'Rohan Deshmukh',
      actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      action: 'deployed',
      targetType: 'project',
      targetId: 'proj-4',
      targetTitle: 'Real-Time Telemetry & Event Analytics Engine',
      projectId: 'proj-4',
      projectName: 'Real-Time Telemetry & Event Analytics Engine',
      details: 'Deployed ClickHouse cluster upgrade v24.8 with zero read-lock interruptions.',
      timestamp: '2026-11-04T15:40:00Z'
    }
  ]);

  // Notifications Signal (18 Notifications)
  public notifications = signal<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Critical Task Assigned',
      message: 'Ananya Iyer assigned you to "Configure Istio Service Mesh Mutual TLS with Spiffe/Spire".',
      category: 'assignments',
      read: false,
      timestamp: '15m ago',
      actorName: 'Ananya Iyer',
      actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      priority: 'urgent'
    },
    {
      id: 'notif-2',
      title: 'Milestone Completed Ahead of Schedule',
      message: 'Phase 2: Istio Ingress & Mutual TLS milestone has reached 100% completion.',
      category: 'projects',
      read: false,
      timestamp: '1h ago',
      actorName: 'Karthik Swaminathan',
      actorAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      priority: 'normal'
    },
    {
      id: 'notif-3',
      title: 'Blocked Task Alert',
      message: 'Vikram Malhotra marked "Multi-Tenant SAML 2.0 Identity Provider Federation" as blocked.',
      category: 'tasks',
      read: false,
      timestamp: '2h ago',
      actorName: 'Vikram Malhotra',
      actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      priority: 'urgent'
    },
    {
      id: 'notif-4',
      title: 'New Mention in Architecture Channel',
      message: 'Pooja Sundaram mentioned you in #design-systems: "Reviewing charcoal token elevation values."',
      category: 'mentions',
      read: true,
      timestamp: '4h ago',
      actorName: 'Pooja Sundaram',
      actorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'notif-5',
      title: 'System Security Audit Completed',
      message: 'Weekly automated vulnerability scanner passed with 0 high/critical CVEs.',
      category: 'system',
      read: true,
      timestamp: '1d ago',
      actorName: 'Vertex Bot'
    }
  ]);

  // Documents Signal (12 Documents)
  public documents = signal<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'RFC-409: Citus Distributed Table & Partitioning Strategy',
      folder: 'Architecture & RFCs',
      description: 'Comprehensive specification for decomposing monolithic billing & order tables into partitioned shards.',
      fileType: 'pdf',
      size: '3.8 MB',
      ownerId: 'usr-12',
      ownerName: 'Priya Sharma',
      ownerAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      lastModified: '2026-11-04T18:22:00Z',
      sharedStatus: 'internal',
      tags: ['PostgreSQL', 'RFC', 'Architecture'],
      favorite: true,
      version: 'v2.4'
    },
    {
      id: 'doc-2',
      title: 'Graphite Visual Design System & Token Specifications',
      folder: 'Design Systems',
      description: 'Core design token bible detailing surface colors, typography, micro-interactions, and accessible contrast rules.',
      fileType: 'figma',
      size: '14.2 MB',
      ownerId: 'usr-3',
      ownerName: 'Pooja Sundaram',
      ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      lastModified: '2026-11-05T09:15:00Z',
      sharedStatus: 'internal',
      tags: ['DesignTokens', 'Figma', 'WCAG'],
      favorite: true,
      version: 'v3.1'
    },
    {
      id: 'doc-3',
      title: 'SOC2 Type II Security Controls & Audit Evidence Package',
      folder: 'Security & Governance',
      description: 'Auditor verification documentation including WebAuthn policies, KMS key rotation procedures, and intrusion logs.',
      fileType: 'pdf',
      size: '8.6 MB',
      ownerId: 'usr-4',
      ownerName: 'Vikram Malhotra',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      lastModified: '2026-11-02T14:00:00Z',
      sharedStatus: 'restricted',
      tags: ['Compliance', 'SOC2', 'Audit'],
      favorite: false,
      version: 'v1.0'
    },
    {
      id: 'doc-4',
      title: 'Vertex Public API v2 OpenAPI 3.1 Specification',
      folder: 'Developer Platform',
      description: 'Complete swagger/OpenAPI schema documentation covering all public REST endpoints, rate limits, and webhooks.',
      fileType: 'markdown',
      size: '1.2 MB',
      ownerId: 'usr-5',
      ownerName: 'Arjun Nambiar',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      lastModified: '2026-10-30T11:20:00Z',
      sharedStatus: 'public',
      tags: ['API', 'OpenAPI', 'SDK'],
      favorite: true,
      version: 'v2.0-rc2'
    },
    {
      id: 'doc-5',
      title: 'Q4 2026 Enterprise Budget & Headcount Model',
      folder: 'Financials & Executive',
      description: 'Multi-department engineering capital allocation, cloud compute forecasts, and hiring roadmap.',
      fileType: 'sheet',
      size: '5.1 MB',
      ownerId: 'usr-20',
      ownerName: 'Harish Venkataraman',
      ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      lastModified: '2026-11-01T16:00:00Z',
      sharedStatus: 'restricted',
      tags: ['Financials', 'Budget', 'Leadership'],
      favorite: false,
      version: 'v3.0'
    }
  ]);

  // Goals Signal (OKR Goals)
  public goals = signal<Goal[]>([
    {
      id: 'goal-1',
      title: 'Achieve Sub-10ms Global Latency Across Multi-Region Kubernetes Mesh',
      description: 'Transition all edge ingestion traffic to the Istio service mesh across US, EU, and APAC clusters.',
      type: 'company',
      ownerId: 'usr-1',
      ownerName: 'Ananya Iyer',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      targetQuarter: 'Q4 2026',
      progress: 78,
      status: 'on_track',
      deadline: '2026-12-31',
      relatedProjectIds: ['proj-1'],
      keyResults: [
        { id: 'kr-1', title: 'Average global p95 latency under 10ms', currentValue: 8.8, targetValue: 10, unit: 'ms', status: 'completed' },
        { id: 'kr-2', title: 'Automatic failover recovery under 15 seconds', currentValue: 12, targetValue: 15, unit: 'sec', status: 'on_track' },
        { id: 'kr-3', title: '100% mTLS cipher verification across microservices', currentValue: 82, targetValue: 100, unit: '%', status: 'on_track' }
      ]
    },
    {
      id: 'goal-2',
      title: 'Roll Out Enterprise Design System 3.0 Across All Production Workspaces',
      description: 'Migrate 100% of legacy CSS and bootstrap views to the Graphite enterprise token standard with AAA accessibility.',
      type: 'team',
      teamId: 'team-2',
      teamName: 'Design Systems & UX Foundations',
      ownerId: 'usr-3',
      ownerName: 'Pooja Sundaram',
      ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      targetQuarter: 'Q4 2026',
      progress: 84,
      status: 'on_track',
      deadline: '2026-11-30',
      relatedProjectIds: ['proj-2'],
      keyResults: [
        { id: 'kr-4', title: 'Component library accessibility score at 100%', currentValue: 98, targetValue: 100, unit: '%', status: 'on_track' },
        { id: 'kr-5', title: 'Migrate 45 production screens to Graphite tokens', currentValue: 38, targetValue: 45, unit: 'screens', status: 'on_track' }
      ]
    },
    {
      id: 'goal-3',
      title: 'Achieve SOC2 Type II Certification & Zero-Trust Compliance Readiness',
      description: 'Ensure 100% employee compliance with FIDO2 WebAuthn keys and complete third-party auditor penetration tests.',
      type: 'company',
      ownerId: 'usr-4',
      ownerName: 'Vikram Malhotra',
      ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      targetQuarter: 'Q4 2026',
      progress: 62,
      status: 'at_risk',
      deadline: '2026-12-15',
      relatedProjectIds: ['proj-3', 'proj-7'],
      keyResults: [
        { id: 'kr-6', title: 'Hardware WebAuthn key adoption rate', currentValue: 100, targetValue: 100, unit: '%', status: 'completed' },
        { id: 'kr-7', title: 'Resolve all High & Critical audit items', currentValue: 14, targetValue: 20, unit: 'items', status: 'at_risk' }
      ]
    }
  ]);

  // Chat Channels Signal
  public chatChannels = signal<ChatChannel[]>([
    {
      id: 'chan-1',
      name: 'general',
      type: 'channel',
      topic: 'Vertex Platform company-wide announcements and architectural strategy',
      isPrivate: false,
      unreadCount: 0,
      memberIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5'],
      lastMessage: 'Istio multi-region failover drill scheduled for tomorrow 10:00 AM IST.',
      lastMessageTime: '10:14 AM'
    },
    {
      id: 'chan-2',
      name: 'architecture-core',
      type: 'channel',
      topic: 'Distributed systems, performance benchmarks, and core frameworks',
      isPrivate: true,
      unreadCount: 3,
      memberIds: ['usr-1', 'usr-5', 'usr-12', 'usr-18'],
      lastMessage: 'Verified that the certificate authority handoff does not impact connection pooling.',
      lastMessageTime: '11:32 AM'
    },
    {
      id: 'chan-3',
      name: 'design-systems-graphite',
      type: 'channel',
      topic: 'Design tokens, dark/light theme switching, and WCAG accessibility standards',
      isPrivate: false,
      unreadCount: 1,
      memberIds: ['usr-3', 'usr-6', 'usr-9', 'usr-15'],
      lastMessage: 'Added the new warm neutral surface tokens into master branch.',
      lastMessageTime: '9:45 AM'
    },
    {
      id: 'chan-4',
      name: 'secops-compliance',
      type: 'channel',
      topic: 'Zero-trust auth, WebAuthn keys, SOC2 audit progress',
      isPrivate: true,
      unreadCount: 0,
      memberIds: ['usr-4', 'usr-11', 'usr-1'],
      lastMessage: 'Okta SAML assertion test suite is now 80% passing in staging.',
      lastMessageTime: 'Yesterday'
    },
    {
      id: 'dm-1',
      name: 'Pooja Sundaram',
      type: 'direct',
      isPrivate: true,
      unreadCount: 0,
      memberIds: ['usr-1', 'usr-3'],
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      status: 'busy',
      lastMessage: 'Can you take a quick look at the Kanban drop animation specs?',
      lastMessageTime: '11:05 AM'
    },
    {
      id: 'dm-2',
      name: 'Vikram Malhotra',
      type: 'direct',
      isPrivate: true,
      unreadCount: 2,
      memberIds: ['usr-1', 'usr-4'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      lastMessage: 'The SOC2 auditor asked for the architecture diagram signed off.',
      lastMessageTime: '8:20 AM'
    }
  ]);

  // Chat Messages Signal (realistic channel history)
  public chatMessages = signal<ChatMessage[]>([
    {
      id: 'msg-1',
      channelId: 'chan-2',
      senderId: 'usr-1',
      senderName: 'Ananya Iyer',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Principal Solutions Architect',
      content: 'Good morning team. We have scheduled the Istio cross-region failover drill for tomorrow morning at 10:00 AM IST. Please ensure canary monitoring metrics are actively streaming to Grafana.',
      timestamp: '9:30 AM',
      reactions: [{ emoji: '🚀', count: 4, users: ['usr-5', 'usr-12', 'usr-18', 'usr-2'] }],
      pinned: true
    },
    {
      id: 'msg-2',
      channelId: 'chan-2',
      senderId: 'usr-12',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Principal Database Reliability Engineer',
      content: 'I have pre-warmed the PostgreSQL replica connections in EU-Central-1. Connection pool standby handles up to 12,000 active transactions without degradation.',
      timestamp: '9:48 AM',
      reactions: [{ emoji: '👍', count: 3, users: ['usr-1', 'usr-5', 'usr-18'] }]
    },
    {
      id: 'msg-3',
      channelId: 'chan-2',
      senderId: 'usr-5',
      senderName: 'Arjun Nambiar',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      senderRole: 'Staff Backend Engineer',
      content: 'Apollo Router federation will automatically route subgraph traffic to the nearest healthy datacenter based on dynamic latency probing.',
      timestamp: '10:05 AM',
      reactions: [{ emoji: '⚡', count: 5, users: ['usr-1', 'usr-12', 'usr-18', 'usr-3', 'usr-4'] }]
    },
    {
      id: 'msg-4',
      channelId: 'chan-2',
      senderId: 'usr-18',
      senderName: 'Karthik Swaminathan',
      senderAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      senderRole: 'DevOps & Reliability Engineer',
      content: 'ArgoCD sync completed. The Karpenter node pools are primed with 50 reserved c7g.2xlarge Graviton instances ready for instant scaling.',
      timestamp: '10:45 AM'
    }
  ]);

  // Resource Workload Signal
  public memberWorkloads = signal<MemberWorkload[]>([
    {
      userId: 'usr-1',
      userName: 'Ananya Iyer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Principal Solutions Architect',
      department: 'Core Architecture',
      weeklyCapacity: 40,
      assignedHours: 36,
      utilizationPercentage: 90,
      status: 'optimal',
      assignedProjects: [
        { projectId: 'proj-1', projectName: 'Global Cloud Mesh', hours: 20 },
        { projectId: 'proj-3', projectName: 'Zero-Trust Auth', hours: 8 },
        { projectId: 'proj-8', projectName: 'AI Predictive Workload', hours: 8 }
      ],
      days: [
        { date: '2026-11-03', dayName: 'Mon', assignedHours: 8, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-04', dayName: 'Tue', assignedHours: 7.5, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-05', dayName: 'Wed', assignedHours: 7, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-06', dayName: 'Thu', assignedHours: 8, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-07', dayName: 'Fri', assignedHours: 5.5, totalCapacityHours: 8, status: 'normal' }
      ]
    },
    {
      userId: 'usr-3',
      userName: 'Pooja Sundaram',
      userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Staff Design Systems Architect',
      department: 'Design Systems',
      weeklyCapacity: 40,
      assignedHours: 42,
      utilizationPercentage: 105,
      status: 'overloaded',
      assignedProjects: [
        { projectId: 'proj-2', projectName: 'Design System 3.0', hours: 34 },
        { projectId: 'proj-5', projectName: 'Mobile Suite v4.0', hours: 8 }
      ],
      days: [
        { date: '2026-11-03', dayName: 'Mon', assignedHours: 9, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-04', dayName: 'Tue', assignedHours: 8.5, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-05', dayName: 'Wed', assignedHours: 8.5, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-06', dayName: 'Thu', assignedHours: 8, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-07', dayName: 'Fri', assignedHours: 8, totalCapacityHours: 8, status: 'normal' }
      ]
    },
    {
      userId: 'usr-6',
      userName: 'Devendra Verma',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Senior Frontend Engineer',
      department: 'Design Systems',
      weeklyCapacity: 40,
      assignedHours: 32,
      utilizationPercentage: 80,
      status: 'optimal',
      assignedProjects: [
        { projectId: 'proj-2', projectName: 'Design System 3.0', hours: 32 }
      ],
      days: [
        { date: '2026-11-03', dayName: 'Mon', assignedHours: 6.5, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-04', dayName: 'Tue', assignedHours: 6.5, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-05', dayName: 'Wed', assignedHours: 7, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-06', dayName: 'Thu', assignedHours: 6, totalCapacityHours: 8, status: 'normal' },
        { date: '2026-11-07', dayName: 'Fri', assignedHours: 6, totalCapacityHours: 8, status: 'normal' }
      ]
    },
    {
      userId: 'usr-12',
      userName: 'Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Principal Database Reliability Engineer',
      department: 'Cloud & Infrastructure',
      weeklyCapacity: 40,
      assignedHours: 44,
      utilizationPercentage: 110,
      status: 'overloaded',
      assignedProjects: [
        { projectId: 'proj-1', projectName: 'Global Cloud Mesh', hours: 18 },
        { projectId: 'proj-9', projectName: 'Legacy Monolith Sharding', hours: 26 }
      ],
      days: [
        { date: '2026-11-03', dayName: 'Mon', assignedHours: 9, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-04', dayName: 'Tue', assignedHours: 9.5, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-05', dayName: 'Wed', assignedHours: 9, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-06', dayName: 'Thu', assignedHours: 8.5, totalCapacityHours: 8, status: 'overloaded' },
        { date: '2026-11-07', dayName: 'Fri', assignedHours: 8, totalCapacityHours: 8, status: 'normal' }
      ]
    },
    {
      userId: 'usr-13',
      userName: 'Aditya Kulkarni',
      userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      roleTitle: 'Machine Learning Engineer',
      department: 'Data Intelligence',
      weeklyCapacity: 40,
      assignedHours: 24,
      utilizationPercentage: 60,
      status: 'available',
      assignedProjects: [
        { projectId: 'proj-8', projectName: 'AI Predictive Workload', hours: 24 }
      ],
      days: [
        { date: '2026-11-03', dayName: 'Mon', assignedHours: 5, totalCapacityHours: 8, status: 'underutilized' },
        { date: '2026-11-04', dayName: 'Tue', assignedHours: 5, totalCapacityHours: 8, status: 'underutilized' },
        { date: '2026-11-05', dayName: 'Wed', assignedHours: 5, totalCapacityHours: 8, status: 'underutilized' },
        { date: '2026-11-06', dayName: 'Thu', assignedHours: 4.5, totalCapacityHours: 8, status: 'underutilized' },
        { date: '2026-11-07', dayName: 'Fri', assignedHours: 4.5, totalCapacityHours: 8, status: 'underutilized' }
      ]
    }
  ]);

  // Time Tracking Entries Signal
  public timeEntries = signal<TimeEntry[]>([
    {
      id: 'te-1',
      userId: 'usr-1',
      userName: 'Ananya Iyer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      projectId: 'proj-1',
      projectName: 'Global Cloud Mesh & Kubernetes Modernization',
      taskId: 'tsk-101',
      taskTitle: 'Configure Istio Service Mesh Mutual TLS with Spiffe/Spire',
      description: 'SPIFFE daemonset configuration and multi-cluster CA certificate exchange verification.',
      date: '2026-11-05',
      durationMinutes: 210, // 3h 30m
      billable: true,
      status: 'approved'
    },
    {
      id: 'te-2',
      userId: 'usr-1',
      userName: 'Ananya Iyer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      projectId: 'proj-8',
      projectName: 'AI-Powered Predictive Workload & Resource Allocator',
      taskId: 'tsk-803',
      taskTitle: 'Heatmap Visualization for Team Capacity and Workload Bottlenecks',
      description: 'Designed capacity threshold matrix and connected real-time utilization formulas.',
      date: '2026-11-05',
      durationMinutes: 150, // 2h 30m
      billable: true,
      status: 'submitted'
    },
    {
      id: 'te-3',
      userId: 'usr-6',
      userName: 'Devendra Verma',
      userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      taskId: 'tsk-202',
      taskTitle: 'Interactive High-Density Data Grid with Column Pinning',
      description: 'Virtualized viewport rendering optimizations and column resize grab handles.',
      date: '2026-11-05',
      durationMinutes: 240, // 4h
      billable: true,
      status: 'approved'
    },
    {
      id: 'te-4',
      userId: 'usr-3',
      userName: 'Pooja Sundaram',
      userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      projectId: 'proj-2',
      projectName: 'Design System 3.0: Graphite & Carbon Foundations',
      taskId: 'tsk-201',
      taskTitle: 'Graphite Theme Variable Engine & SCSS Tokens Spec',
      description: 'WCAG 2.2 color contrast review and token elevation documentation.',
      date: '2026-11-04',
      durationMinutes: 300, // 5h
      billable: true,
      status: 'approved'
    }
  ]);

  // Roles and Permissions Matrix
  public roleDefinitions = signal<RoleDefinition[]>([
    {
      id: 'admin',
      name: 'Super Administrator',
      description: 'Full unconstrained platform control, billing, user management, and security audit logs.',
      userCount: 3,
      badgeColor: '#10B981',
      permissions: {
        projects: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        tasks: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        financials: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        team_members: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        reports: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        system_settings: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        integrations: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        audit_logs: ['view', 'create', 'edit', 'delete', 'manage', 'export']
      }
    },
    {
      id: 'project_manager',
      name: 'Project Manager',
      description: 'Oversees project delivery, budget tracking, milestone deadlines, and sprint velocity.',
      userCount: 6,
      badgeColor: '#F59E0B',
      permissions: {
        projects: ['view', 'create', 'edit', 'manage', 'export'],
        tasks: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        financials: ['view', 'export'],
        team_members: ['view', 'edit'],
        reports: ['view', 'create', 'export'],
        system_settings: ['view'],
        integrations: ['view', 'edit'],
        audit_logs: ['view']
      }
    },
    {
      id: 'team_lead',
      name: 'Technical Team Lead',
      description: 'Leads engineering sprints, code reviews, technical architecture, and workload rebalancing.',
      userCount: 8,
      badgeColor: '#8B5CF6',
      permissions: {
        projects: ['view', 'edit'],
        tasks: ['view', 'create', 'edit', 'delete', 'manage', 'export'],
        financials: ['view'],
        team_members: ['view', 'edit'],
        reports: ['view', 'export'],
        system_settings: ['view'],
        integrations: ['view'],
        audit_logs: ['view']
      }
    },
    {
      id: 'developer',
      name: 'Senior Developer / Engineer',
      description: 'Designs, implements, tests code, logs time entries, updates task states, and comments.',
      userCount: 28,
      badgeColor: '#10B981',
      permissions: {
        projects: ['view'],
        tasks: ['view', 'create', 'edit'],
        financials: [],
        team_members: ['view'],
        reports: ['view'],
        system_settings: [],
        integrations: ['view'],
        audit_logs: []
      }
    },
    {
      id: 'designer',
      name: 'Product / UI/UX Designer',
      description: 'Creates design tokens, prototypes, user journeys, reviews accessibility, and logs design work.',
      userCount: 5,
      badgeColor: '#EA580C',
      permissions: {
        projects: ['view'],
        tasks: ['view', 'create', 'edit'],
        financials: [],
        team_members: ['view'],
        reports: ['view'],
        system_settings: [],
        integrations: ['view'],
        audit_logs: []
      }
    },
    {
      id: 'employee',
      name: 'Standard Employee',
      description: 'Standard workspace collaborator with read access to assigned projects and tasks.',
      userCount: 42,
      badgeColor: '#71717A',
      permissions: {
        projects: ['view'],
        tasks: ['view', 'edit'],
        financials: [],
        team_members: ['view'],
        reports: ['view'],
        system_settings: [],
        integrations: [],
        audit_logs: []
      }
    },
    {
      id: 'viewer',
      name: 'Executive / Stakeholder Viewer',
      description: 'Read-only access to executive dashboards, milestones, reports, and high-level health metrics.',
      userCount: 12,
      badgeColor: '#EAB308',
      permissions: {
        projects: ['view', 'export'],
        tasks: ['view'],
        financials: ['view', 'export'],
        team_members: ['view'],
        reports: ['view', 'export'],
        system_settings: [],
        integrations: [],
        audit_logs: []
      }
    }
  ]);

  // Computed Aggregate Stats for the Dashboard
  public dashboardStats = computed(() => {
    const projs = this.projects();
    const tsks = this.tasks();
    const usrs = this.users();

    const activeProjects = projs.filter(p => p.status === 'active').length;
    const completedTasks = tsks.filter(t => t.status === 'completed').length;
    const dueTodayTasks = tsks.filter(t => t.dueDate.startsWith('2026-11-05') || t.dueDate.startsWith('2026-11-06')).length;
    const overdueTasks = tsks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date('2026-11-05')).length;
    
    // Project Health count
    const healthyProjects = projs.filter(p => p.health === 'healthy').length;
    const atRiskProjects = projs.filter(p => p.health === 'at_risk').length;
    const needsAttentionProjects = projs.filter(p => p.health === 'needs_attention').length;

    // Overall Productivity Score
    const productivityScore = 91.4;

    return {
      activeProjects,
      totalProjects: projs.length,
      completedTasks,
      totalTasks: tsks.length,
      dueTodayTasks,
      overdueTasks,
      teamMembersCount: usrs.length,
      healthyProjects,
      atRiskProjects,
      needsAttentionProjects,
      productivityScore
    };
  });

  // Action Methods
  public addProject(project: Omit<Project, 'id' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...project,
      id: 'proj-' + (this.projects().length + 1),
      updatedAt: new Date().toISOString()
    };
    this.projects.update(list => [newProject, ...list]);
    this.addActivity({
      actorId: this.currentUser().id,
      actorName: this.currentUser().name,
      actorAvatar: this.currentUser().avatar,
      action: 'created',
      targetType: 'project',
      targetId: newProject.id,
      targetTitle: newProject.name,
      projectId: newProject.id,
      projectName: newProject.name,
      details: `Initialized new enterprise project ${newProject.key}`
    });
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): void {
    this.projects.update(list =>
      list.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: 'tsk-' + (this.tasks().length + 101),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.update(list => [newTask, ...list]);
    this.addActivity({
      actorId: this.currentUser().id,
      actorName: this.currentUser().name,
      actorAvatar: this.currentUser().avatar,
      action: 'created',
      targetType: 'task',
      targetId: newTask.id,
      targetTitle: newTask.title,
      projectId: newTask.projectId,
      projectName: newTask.projectName,
      details: `Created task ${newTask.key} (${newTask.priority.toUpperCase()} priority)`
    });
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  }

  public updateTaskStatus(id: string, newStatus: TaskStatus): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;

    this.updateTask(id, { status: newStatus });
    this.addActivity({
      actorId: this.currentUser().id,
      actorName: this.currentUser().name,
      actorAvatar: this.currentUser().avatar,
      action: 'status_change',
      targetType: 'task',
      targetId: id,
      targetTitle: task.title,
      projectId: task.projectId,
      projectName: task.projectName,
      details: `Moved to ${newStatus.replace('_', ' ').toUpperCase()}`
    });
  }

  public deleteTask(id: string): void {
    this.tasks.update(list => list.filter(t => t.id !== id));
  }

  public addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
    const newActivity: Activity = {
      ...activity,
      id: 'act-' + (this.activities().length + 1),
      timestamp: new Date().toISOString()
    };
    this.activities.update(list => [newActivity, ...list]);
  }

  public addTimeEntry(entry: Omit<TimeEntry, 'id'>): TimeEntry {
    const newEntry: TimeEntry = {
      ...entry,
      id: 'te-' + (this.timeEntries().length + 1)
    };
    this.timeEntries.update(list => [newEntry, ...list]);
    return newEntry;
  }

  public sendChatMessage(channelId: string, content: string): void {
    const user = this.currentUser();
    const newMsg: ChatMessage = {
      id: 'msg-' + (this.chatMessages().length + 1),
      channelId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      senderRole: user.roleTitle,
      content,
      timestamp: 'Just now'
    };
    this.chatMessages.update(list => [...list, newMsg]);

    // Update channel last message
    this.chatChannels.update(list =>
      list.map(c => (c.id === channelId ? { ...c, lastMessage: content, lastMessageTime: 'Just now' } : c))
    );
  }

  public addCalendarEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'evt-' + (this.events().length + 1)
    };
    this.events.update(list => [...list, newEvent]);
    return newEvent;
  }

  public markNotificationAsRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }
}

