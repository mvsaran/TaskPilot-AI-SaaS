"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Starting high-performance enterprise seeding for TaskPilot AI...');
    const startTime = Date.now();
    // Clean existing data
    console.log('🧹 Cleaning existing database records...');
    await prisma.tokenUsageLog.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.knowledgeChunk.deleteMany();
    await prisma.knowledgeDocument.deleteMany();
    await prisma.aiPromptHistory.deleteMany();
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.subtask.deleteMany();
    await prisma.task.deleteMany();
    await prisma.story.deleteMany();
    await prisma.epic.deleteMany();
    await prisma.sprint.deleteMany();
    await prisma.project.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();
    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);
    // 1. Create Demo Fixed Users (one for each role)
    console.log('👤 Creating demo accounts and 100 enterprise users...');
    const demoAccounts = [
        { email: 'admin@taskpilot.ai', fullName: 'Sarah Connor (Admin)', role: client_1.UserRole.ADMIN },
        { email: 'pm@taskpilot.ai', fullName: 'John Vance (Project Manager)', role: client_1.UserRole.PROJECT_MANAGER },
        { email: 'dev@taskpilot.ai', fullName: 'Alex Rivera (Senior Dev)', role: client_1.UserRole.DEVELOPER },
        { email: 'qa@taskpilot.ai', fullName: 'Maya Lin (Lead QA)', role: client_1.UserRole.QA_ENGINEER },
        { email: 'po@taskpilot.ai', fullName: 'David Chen (Product Owner)', role: client_1.UserRole.PRODUCT_OWNER },
        { email: 'viewer@taskpilot.ai', fullName: 'Emma Watson (Stakeholder Viewer)', role: client_1.UserRole.VIEWER },
    ];
    const createdDemoUsers = [];
    for (const acc of demoAccounts) {
        const u = await prisma.user.create({
            data: {
                email: acc.email,
                passwordHash: defaultPasswordHash,
                fullName: acc.fullName,
                role: acc.role,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(acc.email)}`,
                isActive: true,
            },
        });
        createdDemoUsers.push(u);
    }
    // Generate remaining 94 users to reach 100 users
    const rolesList = [
        client_1.UserRole.DEVELOPER, client_1.UserRole.DEVELOPER, client_1.UserRole.DEVELOPER,
        client_1.UserRole.QA_ENGINEER, client_1.UserRole.PROJECT_MANAGER, client_1.UserRole.PRODUCT_OWNER, client_1.UserRole.VIEWER
    ];
    const userBatch = [];
    for (let i = 1; i <= 94; i++) {
        const role = rolesList[i % rolesList.length];
        userBatch.push({
            email: `user.${i}@taskpilot.ai`,
            passwordHash: defaultPasswordHash,
            fullName: `Enterprise User ${i} (${role})`,
            role: role,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=user_${i}`,
            isActive: true,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
        });
    }
    await prisma.user.createMany({ data: userBatch });
    const allUsers = await prisma.user.findMany();
    console.log(`✅ Created ${allUsers.length} total users.`);
    // 2. Create 20 Teams
    console.log('🏢 Creating 20 enterprise teams...');
    const teamNames = [
        'Core Engineering & API', 'AI RAG Pipeline & LLM', 'Frontend Experience & Design',
        'DevOps & Cloud Platform', 'QA Automation & Performance', 'Product & Strategy',
        'Security & Compliance', 'Mobile Apps Core', 'Analytics & Telemetry',
        'Customer Success Tech', 'Billing & Payments Platform', 'Integrations Hub',
        'Data Platform & Pipelines', 'Enterprise Search Engine', 'Realtime Collaboration Pod',
        'Identity & RBAC Services', 'Infrastructure Optimization', 'Machine Learning Ops',
        'Internal Tools & Portals', 'Design Systems & UI Kit'
    ];
    const createdTeams = [];
    for (const tName of teamNames) {
        const team = await prisma.team.create({
            data: {
                name: tName,
                description: `Dedicated cross-functional team focused on ${tName.toLowerCase()}.`,
            },
        });
        createdTeams.push(team);
    }
    // Assign members to teams
    const teamMemberData = [];
    for (const user of allUsers) {
        const teamIndex = Math.floor(Math.random() * createdTeams.length);
        teamMemberData.push({
            userId: user.id,
            teamId: createdTeams[teamIndex].id,
            role: user.role === client_1.UserRole.PROJECT_MANAGER ? 'Team Lead' : 'Contributor',
        });
    }
    await prisma.teamMember.createMany({ data: teamMemberData, skipDuplicates: true });
    console.log(`✅ Assigned users across ${createdTeams.length} teams.`);
    // 3. Create 300 Projects
    console.log('📁 Creating 300 projects across teams...');
    const projectStatuses = [client_1.ProjectStatus.ACTIVE, client_1.ProjectStatus.PLANNED, client_1.ProjectStatus.ON_HOLD, client_1.ProjectStatus.COMPLETED];
    const projectBatch = [];
    for (let i = 1; i <= 300; i++) {
        const owner = allUsers[Math.floor(Math.random() * allUsers.length)];
        const team = createdTeams[Math.floor(Math.random() * createdTeams.length)];
        const status = projectStatuses[i % projectStatuses.length];
        const health = status === client_1.ProjectStatus.ACTIVE ? Math.round((70 + Math.random() * 30) * 10) / 10 : 100.0;
        projectBatch.push({
            key: `PRJ${i}`,
            name: `Project ${i}: ${team.name} Initiative ${Math.ceil(i / 20)}`,
            description: `Production roadmap and execution tracking for initiative #${i}. Covers architecture, implementation, and deployment milestones.`,
            status: status,
            ownerId: owner.id,
            teamId: team.id,
            healthScore: health,
            riskFactors: JSON.stringify([
                { risk: 'Tight delivery deadline', severity: 'HIGH', mitigated: false },
                { risk: 'External API rate limit dependency', severity: 'MEDIUM', mitigated: true }
            ]),
        });
    }
    await prisma.project.createMany({ data: projectBatch });
    const allProjects = await prisma.project.findMany();
    console.log(`✅ Created ${allProjects.length} projects.`);
    // 4. Create 200 Sprints & Epics/Stories
    console.log('🏃 Creating 200 sprints, epics, and user stories...');
    const sprintBatch = [];
    const epicBatch = [];
    // Pick first 100 projects to get 2 sprints each
    for (let i = 0; i < Math.min(100, allProjects.length); i++) {
        const prj = allProjects[i];
        sprintBatch.push({
            name: `${prj.key} Sprint 1 (Foundation)`,
            goal: `Establish foundational models, API gateway, and initial CI/CD pipeline.`,
            startDate: new Date(Date.now() - 14 * 86400000),
            endDate: new Date(Date.now()),
            status: client_1.SprintStatus.ACTIVE,
            velocity: 45.0,
            projectId: prj.id,
        });
        sprintBatch.push({
            name: `${prj.key} Sprint 2 (AI Integration)`,
            goal: `Integrate OpenAI streaming, RAG vector index, and UI chat drawer.`,
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now() + 14 * 86400000),
            status: client_1.SprintStatus.PLANNED,
            velocity: 0.0,
            projectId: prj.id,
        });
        epicBatch.push({
            key: `${prj.key}-EP1`,
            title: `${prj.name} Core Architecture`,
            description: `Establish high-performance backend architecture with NestJS and Prisma.`,
            status: client_1.TaskStatus.IN_PROGRESS,
            priority: client_1.Priority.CRITICAL,
            projectId: prj.id,
        });
        epicBatch.push({
            key: `${prj.key}-EP2`,
            title: `${prj.name} AI Copilot Integration`,
            description: `Natural language search, bug summarization, and automated sprint planning.`,
            status: client_1.TaskStatus.TODO,
            priority: client_1.Priority.HIGH,
            projectId: prj.id,
        });
    }
    await prisma.sprint.createMany({ data: sprintBatch });
    await prisma.epic.createMany({ data: epicBatch });
    const allSprints = await prisma.sprint.findMany();
    const allEpics = await prisma.epic.findMany();
    // Create stories for epics
    const storyBatch = [];
    for (let i = 0; i < allEpics.length; i++) {
        const epic = allEpics[i];
        storyBatch.push({
            key: `${epic.key}-ST1`,
            title: `Implement OAuth/JWT Authentication & Refresh Token Rotation`,
            description: `Enforce RBAC boundaries across all 6 enterprise roles with stateless JWT tokens.`,
            status: client_1.TaskStatus.DONE,
            priority: client_1.Priority.HIGH,
            storyPoints: 5,
            acceptanceCriteria: JSON.stringify(['Tokens expire in 15m', 'Refresh tokens stored securely']),
            definitionOfDone: JSON.stringify(['Unit tests pass', 'Swagger spec updated']),
            epicId: epic.id,
        });
        storyBatch.push({
            key: `${epic.key}-ST2`,
            title: `Build Real-Time Kanban Board & Drag-and-Drop Swimlanes`,
            description: `Allow developers and PMs to transition tasks across Backlog, TODO, In Progress, Review, and QA.`,
            status: client_1.TaskStatus.IN_PROGRESS,
            priority: client_1.Priority.CRITICAL,
            storyPoints: 8,
            acceptanceCriteria: JSON.stringify(['Smooth drag transitions', 'Optimistic UI update via React Query']),
            definitionOfDone: JSON.stringify(['E2E tests pass', 'Dark mode verified']),
            epicId: epic.id,
        });
    }
    await prisma.story.createMany({ data: storyBatch });
    const allStories = await prisma.story.findMany();
    console.log(`✅ Created ${allSprints.length} sprints, ${allEpics.length} epics, and ${allStories.length} stories.`);
    // 5. Create 5,000 Tasks & Subtasks
    console.log('📋 Creating 5,000 tasks and subtasks in batches...');
    const taskStatuses = [client_1.TaskStatus.TODO, client_1.TaskStatus.IN_PROGRESS, client_1.TaskStatus.IN_REVIEW, client_1.TaskStatus.IN_QA, client_1.TaskStatus.DONE, client_1.TaskStatus.BACKLOG];
    const priorities = [client_1.Priority.CRITICAL, client_1.Priority.HIGH, client_1.Priority.MEDIUM, client_1.Priority.LOW];
    const taskBatch = [];
    for (let i = 1; i <= 5000; i++) {
        const story = allStories[i % allStories.length];
        const sprint = allSprints[i % allSprints.length];
        const assignee = allUsers[i % allUsers.length];
        const reporter = allUsers[(i + 5) % allUsers.length];
        const status = taskStatuses[i % taskStatuses.length];
        const priority = priorities[i % priorities.length];
        taskBatch.push({
            key: `TSK-${i}`,
            title: `Task #${i}: ${status === client_1.TaskStatus.DONE ? '[Completed]' : '[Active]'} Implement ${story ? story.title.substring(0, 35) : 'module feature'} - Module ${Math.ceil(i / 100)}`,
            description: `Detailed engineering work required for task #${i}. Ensure robust validation, exception handling, and observability logs.`,
            status: status,
            priority: priority,
            storyPoints: [1, 2, 3, 5, 8][i % 5],
            estimatedHours: [2, 4, 6, 8, 12][i % 5],
            loggedHours: status === client_1.TaskStatus.DONE ? [2, 4, 6, 8, 12][i % 5] : 1.5,
            dueDate: new Date(Date.now() + ((i % 20) - 5) * 86400000),
            assigneeId: assignee.id,
            reporterId: reporter.id,
            storyId: story ? story.id : null,
            sprintId: sprint ? sprint.id : null,
            createdAt: new Date(Date.now() - (i % 30) * 86400000),
        });
        if (taskBatch.length === 1000) {
            await prisma.task.createMany({ data: taskBatch });
            taskBatch.length = 0;
            console.log(`   ... inserted task batch up to ${i}`);
        }
    }
    if (taskBatch.length > 0) {
        await prisma.task.createMany({ data: taskBatch });
    }
    const allTasks = await prisma.task.findMany({ select: { id: true, title: true } });
    console.log(`✅ Created ${allTasks.length} tasks.`);
    // Create Subtasks (1 for every task)
    const subtaskBatch = [];
    for (let i = 0; i < allTasks.length; i++) {
        subtaskBatch.push({
            title: `Write unit tests & verify edge cases for ${allTasks[i].title.substring(0, 30)}`,
            isCompleted: i % 2 === 0,
            taskId: allTasks[i].id,
            assigneeId: allUsers[i % allUsers.length].id,
        });
        if (subtaskBatch.length === 2000) {
            await prisma.subtask.createMany({ data: subtaskBatch });
            subtaskBatch.length = 0;
        }
    }
    if (subtaskBatch.length > 0) {
        await prisma.subtask.createMany({ data: subtaskBatch });
    }
    console.log(`✅ Created subtasks.`);
    // 6. Create 50,000 Comments using fast batches of 5,000
    console.log('💬 Creating 50,000 comments (batched insertion)...');
    const commentBatch = [];
    const sampleComments = [
        'Reviewed the initial implementation. Looks solid, but please check the Redis caching TTL.',
        'We should ensure our RBAC guard verifies both team membership and system role before allowing mutation.',
        'Passed QA verification on staging. Performance metrics show < 45ms P95 latency.',
        '@pm@taskpilot.ai Can we push this to Sprint 2? We need more time for the pgvector index tuning.',
        'Bug BUG-AI-02 noted during edge testing. RAG context chunk overlap should be increased to 128 tokens.',
        'Updated API spec to include the new structured JSON output schema.',
        'Checking burndown chart: we are slightly ahead of velocity targets for this sprint.',
        'Assigned to @dev@taskpilot.ai for code review and PR merge.',
        'Unit tests added and passing in CI pipeline.',
        'Resolved the optimistic UI flicker when dragging items rapidly across Kanban swimlanes.'
    ];
    for (let i = 1; i <= 50000; i++) {
        const task = allTasks[i % allTasks.length];
        const author = allUsers[i % allUsers.length];
        const content = `${sampleComments[i % sampleComments.length]} (Comment #${i})`;
        commentBatch.push({
            content: content,
            taskId: task.id,
            authorId: author.id,
            mentions: JSON.stringify(i % 4 === 0 ? ['pm@taskpilot.ai', 'dev@taskpilot.ai'] : []),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 86400000),
        });
        if (commentBatch.length === 5000) {
            await prisma.comment.createMany({ data: commentBatch });
            commentBatch.length = 0;
            console.log(`   ... inserted comment batch up to ${i}`);
        }
    }
    if (commentBatch.length > 0) {
        await prisma.comment.createMany({ data: commentBatch });
    }
    console.log('✅ Created 50,000 comments successfully.');
    // 7. Create AI Conversations, Prompt History & Knowledge Base Documents
    console.log('🧠 Creating AI histories, vector documents, and audit logs...');
    const demoAdmin = createdDemoUsers[0];
    const demoPrj = allProjects[0];
    const conversation = await prisma.aiConversation.create({
        data: {
            userId: demoAdmin.id,
            projectId: demoPrj.id,
            title: 'Architectural Review & Risk Analysis Chat',
            messages: {
                create: [
                    {
                        role: 'user',
                        content: 'Can you analyze the current health of PRJ1 and predict any upcoming sprint risks?',
                    },
                    {
                        role: 'assistant',
                        content: 'Based on the sprint velocity of 45.0 and the 2 high-priority tasks currently in code review, PRJ1 has a Health Score of 88%. Risk factor detected: External API rate limit dependency on the embedding pipeline.',
                        citations: JSON.stringify([{ docTitle: 'TaskPilot AI Architecture Specification v1.2', chunkIndex: 1, score: 0.92 }]),
                    }
                ]
            }
        }
    });
    await prisma.aiPromptHistory.create({
        data: {
            promptName: 'task-generator',
            version: 'v1.2.0',
            rawPrompt: 'Build user authentication with JWT and refresh token rotation.',
            rawResponse: JSON.stringify({
                epic: { title: 'User Authentication Module', priority: 'CRITICAL' },
                stories: [{ title: 'Implement JWT Auth Guard', storyPoints: 5 }]
            }),
            latencyMs: 420,
            tokensUsed: 650,
            userId: demoAdmin.id,
        }
    });
    const doc = await prisma.knowledgeDocument.create({
        data: {
            title: 'TaskPilot AI Enterprise Architecture Specification',
            fileName: 'architecture_spec.md',
            fileType: 'markdown',
            status: client_1.DocumentStatus.INDEXED,
            tokenCount: 1420,
            projectId: demoPrj.id,
            uploaderId: demoAdmin.id,
            chunks: {
                create: [
                    {
                        chunkIndex: 0,
                        content: '# TaskPilot AI Architecture\nTaskPilot AI uses NestJS with DDD clean architecture, Prisma ORM, and PostgreSQL with pgvector for RAG embeddings.',
                        tokenCount: 250,
                        metadata: JSON.stringify({ section: 'Introduction', version: '1.0' })
                    },
                    {
                        chunkIndex: 1,
                        content: '## Security & RBAC\nAll requests must pass through the JWT Auth Guard and Role Guard. Six distinct roles exist: Admin, Project Manager, Developer, QA Engineer, Product Owner, Viewer.',
                        tokenCount: 310,
                        metadata: JSON.stringify({ section: 'Security', version: '1.0' })
                    }
                ]
            }
        }
    });
    // Create sample notifications & activity logs
    await prisma.notification.create({
        data: {
            userId: demoAdmin.id,
            type: client_1.NotificationType.AI_ALERT,
            title: 'AI Sprint Planner Suggestion',
            message: 'AI has detected workload imbalance in Sprint 1. Click to review distribution.',
            isRead: false,
            linkUrl: `/projects/${demoPrj.id}/board`,
        }
    });
    const endTime = Date.now();
    console.log(`🎉 Enterprise Seeding Completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds!`);
    console.log('----------------------------------------------------');
    console.log('🔐 DEMO LOGIN CREDENTIALS (all passwords: Password123!):');
    console.log('   👑 Admin:           admin@taskpilot.ai');
    console.log('   📋 Project Manager: pm@taskpilot.ai');
    console.log('   💻 Developer:       dev@taskpilot.ai');
    console.log('   🧪 QA Engineer:     qa@taskpilot.ai');
    console.log('   📦 Product Owner:   po@taskpilot.ai');
    console.log('   👀 Viewer:          viewer@taskpilot.ai');
    console.log('----------------------------------------------------');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map