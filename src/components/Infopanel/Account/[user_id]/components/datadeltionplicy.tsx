import React from 'react';

export default function DataDeletionPolicy() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px', 
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <h1 style={{ 
        color: '#2c3e50', 
        borderBottom: '3px solid #3498db', 
        paddingBottom: '10px',
        marginBottom: '30px'
      }}>
        Data Deletion Policy
      </h1>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          At WikiTime, we are committed to protecting your privacy and giving you control over your personal data. 
          This policy explains how you can request deletion of your data and what happens when you do.
        </p>
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>Your Right to Data Deletion</h2>
        <p>You have the right to request deletion of your personal data at any time. This includes:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Account information (name, email, phone number)</li>
          <li>Profile data and preferences</li>
          <li>Usage history and activity logs</li>
          <li>Any content you have created or uploaded</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>How to Request Data Deletion</h2>
        <p>You can delete your account and data in the following ways:</p>
        <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li><strong>Through Your Account Settings:</strong> Log in to your account and navigate to the account deletion section in your profile settings.</li>
          <li><strong>Contact Us:</strong> Send an email to <a href="mailto:support@wikitime.com" style={{ color: '#3498db' }}>support@wikitime.com</a> with the subject "Data Deletion Request"</li>
          <li><strong>Automated Process:</strong> Use our self-service deletion tool in your account dashboard.</li>
        </ol>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>What Happens After Deletion Request</h2>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li><strong>Immediate Action:</strong> Your account will be deactivated immediately</li>
          <li><strong>30-Day Grace Period:</strong> Your data will be kept for 30 days in case you change your mind</li>
          <li><strong>Permanent Deletion:</strong> After 30 days, all your personal data will be permanently deleted from our systems</li>
          <li><strong>Confirmation:</strong> You will receive an email confirmation once deletion is complete</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>Data We Cannot Delete</h2>
        <p>Some data may be retained for legal or security reasons:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
          <li>Transaction records (for tax and accounting purposes)</li>
          <li>Data required by law to be retained</li>
          <li>Anonymized usage statistics (with no personal identifiers)</li>
          <li>Security logs for fraud prevention</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>Timeline for Deletion</h2>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '5px',
          border: '1px solid #e9ecef'
        }}>
          <p><strong>Step 1:</strong> Request submitted - Account deactivated (0-24 hours)</p>
          <p><strong>Step 2:</strong> Grace period begins - Data marked for deletion (30 days)</p>
          <p><strong>Step 3:</strong> Permanent deletion from all systems (31-45 days)</p>
          <p><strong>Step 4:</strong> Confirmation email sent (within 48 hours of completion)</p>
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', marginBottom: '15px' }}>Contact Information</h2>
        <p>If you have questions about data deletion or need assistance:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '15px', listStyle: 'none' }}>
          <li>📧 Email: <a href="mailto:support@wikitime.com" style={{ color: '#3498db' }}>support@wikitime.com</a></li>
          <li>📧 Privacy Officer: <a href="mailto:privacy@wikitime.com" style={{ color: '#3498db' }}>privacy@wikitime.com</a></li>
          <li>⏰ Response Time: Within 72 hours</li>
        </ul>
      </section>

      <footer style={{ 
        marginTop: '50px', 
        paddingTop: '20px', 
        borderTop: '1px solid #eee',
        fontSize: '14px',
        color: '#666'
      }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>This policy is part of our <a href="/privacy-policy" style={{ color: '#3498db' }}>Privacy Policy</a> and <a href="/terms-of-service" style={{ color: '#3498db' }}>Terms of Service</a>.</p>
      </footer>
    </div>
  );
}