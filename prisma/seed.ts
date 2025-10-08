import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Teachers
  const teacher1 = await prisma.teacher.upsert({
    where: { email: 'akumar@college.edu' },
    update: {},
    create: {
      name: 'Prof. A. Kumar',
      department: 'Computer Science',
      email: 'akumar@college.edu',
    },
  });

  const teacher2 = await prisma.teacher.upsert({
    where: { email: 'bsharma@college.edu' },
    update: {},
    create: {
      name: 'Prof. B. Sharma',
      department: 'Computer Science',
      email: 'bsharma@college.edu',
    },
  });

  const teacher3 = await prisma.teacher.upsert({
    where: { email: 'cverma@college.edu' },
    update: {},
    create: {
      name: 'Prof. C. Verma',
      department: 'Computer Science',
      email: 'cverma@college.edu',
    },
  });

  const teacher4 = await prisma.teacher.upsert({
    where: { email: 'dsingh@college.edu' },
    update: {},
    create: {
      name: 'Prof. D. Singh',
      department: 'Computer Science',
      email: 'dsingh@college.edu',
    },
  });

  console.log('✅ Teachers created');

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { code: 'CSE301' },
    update: {},
    create: {
      code: 'CSE301',
      name: 'Data Structures',
      semester: 5,
      teacherId: teacher1.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code: 'CSE302' },
    update: {},
    create: {
      code: 'CSE302',
      name: 'Operating Systems',
      semester: 5,
      teacherId: teacher2.id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { code: 'CSE303' },
    update: {},
    create: {
      code: 'CSE303',
      name: 'Database Management',
      semester: 5,
      teacherId: teacher3.id,
    },
  });

  const course4 = await prisma.course.upsert({
    where: { code: 'CSE304' },
    update: {},
    create: {
      code: 'CSE304',
      name: 'Computer Networks',
      semester: 5,
      teacherId: teacher4.id,
    },
  });

  console.log('✅ Courses created');

  // Create Demo Student
  const hashedPassword = await bcrypt.hash('password123', 10);

  const student = await prisma.student.upsert({
    where: { email: 'demo@college.edu' },
    update: {},
    create: {
      name: 'Demo Student',
      email: 'demo@college.edu',
      password: hashedPassword,
      rollNo: 'CS21B001',
      semester: 5,
      branch: 'Computer Science',
    },
  });

  console.log('✅ Demo student created');
  console.log('\n📝 Demo Login Credentials:');
  console.log('Email: demo@college.edu');
  console.log('Password: password123\n');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });