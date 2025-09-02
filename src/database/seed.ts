import { initializeDatabase, getConnection } from './connection';

async function seedDatabase() {
  try {
    await initializeDatabase();
    const db = getConnection();

    console.log('Seeding database with test data...');

    // Insert sample courses
    const sampleCourses = [
      {
        course_id: 1,
        title: 'Web3 开发入门',
        description: '学习区块链和智能合约开发的基础知识，包括 Solidity、ethers.js 等技术栈。',
        author: '0x742d35Cc6634C0532925a3b8D65aEd2934C12D5e',
        price: '100000000000000000', // 0.1 ETH in wei
        created_at: Math.floor(Date.now() / 1000)
      },
      {
        course_id: 2,
        title: 'DeFi 协议深度解析',
        description: '深入了解去中心化金融协议的工作原理，学习如何构建 DeFi 应用。',
        author: '0x8ba1f109551bD432803012645Hac136c4c5F5Cf5',
        price: '200000000000000000', // 0.2 ETH in wei
        created_at: Math.floor(Date.now() / 1000) - 86400
      },
      {
        course_id: 3,
        title: 'NFT 市场开发实战',
        description: '从零开始构建一个完整的 NFT 交易市场，包括智能合约和前端界面。',
        author: '0x742d35Cc6634C0532925a3b8D65aEd2934C12D5e',
        price: '150000000000000000', // 0.15 ETH in wei
        created_at: Math.floor(Date.now() / 1000) - 172800
      },
      {
        course_id: 4,
        title: 'Solidity 高级编程技巧',
        description: '掌握 Solidity 的高级特性，包括优化技巧、安全最佳实践和复杂合约设计。',
        author: '0x9fE46736679d2D9a65F0992F2272de9f3c7fa6e0',
        price: '250000000000000000', // 0.25 ETH in wei
        created_at: Math.floor(Date.now() / 1000) - 259200
      },
      {
        course_id: 5,
        title: 'Layer 2 扩容方案详解',
        description: '了解各种 Layer 2 扩容解决方案，包括 Polygon、Arbitrum、Optimism 等。',
        author: '0x8ba1f109551bD432803012645Hac136c4c5F5Cf5',
        price: '180000000000000000', // 0.18 ETH in wei
        created_at: Math.floor(Date.now() / 1000) - 345600
      }
    ];

    for (const course of sampleCourses) {
      await db.execute(
        `INSERT IGNORE INTO courses (course_id, title, description, author, price, created_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [course.course_id, course.title, course.description, course.author, course.price, course.created_at]
      );
    }

    // Insert sample purchases
    const samplePurchases = [
      {
        course_id: 1,
        buyer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        price: '100000000000000000',
        transaction_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      },
      {
        course_id: 2,
        buyer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        price: '200000000000000000',
        transaction_hash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef'
      },
      {
        course_id: 3,
        buyer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        price: '150000000000000000',
        transaction_hash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef'
      }
    ];

    for (const purchase of samplePurchases) {
      await db.execute(
        `INSERT IGNORE INTO purchases (course_id, buyer, price, transaction_hash) 
         VALUES (?, ?, ?, ?)`,
        [purchase.course_id, purchase.buyer, purchase.price, purchase.transaction_hash]
      );
    }

    console.log('Database seeded successfully with:');
    console.log(`- ${sampleCourses.length} sample courses`);
    console.log(`- ${samplePurchases.length} sample purchases`);
    console.log('\
You can now test the API endpoints!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();"