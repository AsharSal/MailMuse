'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('EmailTemplates', [
      {
        name: 'HR',
        description: 'Used for interviews, rejection letters, and onboarding communication.',
        structure: `Dear [Candidate Name],

Thank you for your interest in the [Job Title] position at [Company Name]. We have reviewed your application and would like to [invite you for an interview / inform you that we have decided to move forward with other candidates].

Please let us know if you have any questions.

Best regards,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sales',
        description: 'For product pitching, follow-ups, and cold outreach to potential clients.',
        structure: `Hi [Client Name],

I wanted to follow up and introduce you to [Product/Service Name]. It’s designed to help businesses like yours [Value Proposition or Benefit].

Would you be open to a quick conversation this week?

Best,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Support',
        description: 'For responding to issues or providing support updates.',
        structure: `Hello [Customer Name],

Thank you for reaching out. We understand that you're experiencing [Issue Summary] and we’re currently working on a resolution.

We appreciate your patience and will keep you updated on progress.

Sincerely,  
[Support Team]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Marketing',
        description: 'For sending promotional or campaign-related messages.',
        structure: `Hi [First Name],

Exciting news! [Product/Service Name] is now available, and it’s packed with features to help you [Benefit].

Take advantage of our limited-time offer—[Offer Details].

Cheers,  
[Your Marketing Team]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'General',
        description: 'Default email template for general-purpose communication.',
        structure: `Dear [Name],

I hope you're doing well. I wanted to reach out regarding [Subject].

Let me know if you have any questions or need additional information.

Best regards,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Feedback',
        description: 'To ask for or respond to feedback from users or colleagues.',
        structure: `Hi [Name],

I’d love to hear your thoughts on [Topic/Service/Experience]. Your feedback helps us improve and better meet your needs.

Thank you in advance for taking the time.

Warm regards,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ThankYou',
        description: 'Gratitude emails after meetings, interviews, or assistance.',
        structure: `Dear [Name],

Thank you for taking the time to [Meeting/Event/Help Provided]. I truly appreciate your effort and support.

Looking forward to staying in touch.

Sincerely,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'FollowUp',
        description: 'Used after meetings, demos, or sales calls to reconnect.',
        structure: `Hi [Name],

Just following up on our recent [Meeting/Call/Demo] regarding [Topic]. Let me know if you have any additional questions or need more info.

Looking forward to your thoughts.

Best,  
[Your Name]`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('EmailTemplates', null, {});
  }
};
