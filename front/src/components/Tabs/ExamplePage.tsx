import React from 'react';
import { TabsContainer, Tab } from './Tab';

const ExamplePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Example of Tabs</h1>
      <TabsContainer>
        <Tab label="Profile">
          <div>Content for Profile</div>
        </Tab>
        <Tab label="Dashboard">
          <div>Content for Dashboard</div>
        </Tab>
        <Tab label="Settings">
          <div>Content for Settings</div>
        </Tab>
        <Tab label="Contacts">
          <div>Content for Contacts</div>
        </Tab>
        <Tab label="Disabled" disabled>
          <div>Content for Disabled</div>
        </Tab>
      </TabsContainer>
    </div>
  );
};

export default ExamplePage;
