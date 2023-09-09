const privacyPolicy = [
  {
    title: 'Privacy Policy for Odmaralica',
    description: `
      <p><strong>Last Updated: 09.09.2023.</strong></p>
      <p>This Privacy Policy describes how Odmaralica ("we," "us," or "our") collects, uses, and protects the personal information of users ("you" or "user") of our web application. We are committed to protecting your privacy and ensuring the security of your personal data.</p>
    `,
  },
  {
    title: '1. Information We Collect',
    description: `
      <p><strong>1.1 User Registration Data</strong></p>
      <ul>
        <li>When you register on Odmaralica, we collect the following information:</li>
        <li>First name</li>
        <li>Last name</li>
        <li>Email address</li>
        <li>Phone number (optional)</li>
        <li>Description (optional)</li>
      </ul>

      <p><strong>1.2 Server Log Data</strong></p>
      <p>For security purposes, when you use our services, we log your IP address along with your email address. This log data is encrypted using AES encryption and can only be accessed and decrypted by our system administrator under specific circumstances, such as security concerns, attacks on the web application, or debugging.</p>
    `,
  },
  {
    title: '2. Purpose of Data Collection',
    description: `
      <p>We collect and process your personal data for the following purposes:</p>
      <ul>
        <li>To provide you with access to our booking services.</li>
        <li>To improve our platform and services.</li>
        <li>To ensure the security of our web application.</li>
        <li>To communicate with you and provide support.</li>
      </ul>
    `,
  },
  {
    title: '3. User Consent and Control',
    description: `
      <p><strong>3.1 Acceptance of Privacy Policy</strong></p>
      <p>In order to make a reservation, you must accept our Privacy Policy. By accepting the policy, you consent to the collection and processing of your personal data as described herein.</p>

      <p><strong>3.2 Revoking Consent</strong></p>
      <p>You have the right to revoke your consent for data processing at any time, under the following conditions:</p>
      <ul>
        <li>You may revoke your consent for data processing if you have no upcoming or active reservations.</li>
        <li>To revoke your consent, please visit localhost:3000/revoke-privacy-policy-consent.</li>
      </ul>
    `,
  },
  {
    title: '4. Data Deletion',
    description: `
      <p>You can request the deletion of your personal data by sending a request to localhost:3000/delete-my-account. However, please note the following conditions:</p>
      <ul>
        <li>Your data can only be deleted if you have no active or upcoming reservations.</li>
        <li>If you have active reservations, you must cancel them yourself before requesting data deletion.</li>
      </ul>
    `,
  },
  {
    title: '5. Cookies and Tracking',
    description: `<p>We do not use cookies or tracking technologies on our web application.</p>`,
  },
  {
    title: '6. Data Security',
    description: `
      <p>We implement industry-standard security measures, including encryption and access controls, to protect your personal data. Only authorized personnel can access and view this data.</p>
    `,
  },
  {
    title: '7. Contact Information',
    description: `
      <p>If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at:</p>
      <p>Email: odmaralica@gmail.com</p>
    `,
  },
];

export default privacyPolicy;
