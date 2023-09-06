import React from 'react';
import privacyPolicy from 'data/privacyPolicy';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <h1 className="privacy-policy-heading">Privacy Policy</h1>
      <div className="privacy-policy-container">
        {privacyPolicy.map((policy) => (
          <div className="privacy-policy-item">
            <h2>{policy.title}</h2>
            <p>{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
