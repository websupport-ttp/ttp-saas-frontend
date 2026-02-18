'use client';

import { useState, useEffect } from 'react';
import { appConfig } from '@/lib/config';

export default function ConfigTestPage() {
  const [configData, setConfigData] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);

  useEffect(() => {
    // Test configuration
    setConfigData({
      apiBaseUrl: appConfig.apiBaseUrl,
      apiTimeout: appConfig.apiTimeout,
      siteName: appConfig.siteName,
      siteUrl: appConfig.siteUrl,
    });

    // Test API connection
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection to:', appConfig.apiBaseUrl);
      
      // Test health endpoint
      const healthUrl = appConfig.apiBaseUrl.replace('/api/v1', '/health');
      const healthResponse = await fetch(healthUrl);
      const healthData = await healthResponse.json();
      
      // Test airport search
      const searchUrl = `${appConfig.apiBaseUrl}/reference/airports/search?q=London&limit=5`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      setApiTest({
        health: {
          status: healthResponse.status,
          data: healthData,
          success: healthResponse.ok
        },
        search: {
          status: searchResponse.status,
          data: searchData,
          success: searchResponse.ok
        }
      });
    } catch (error: any) {
      setApiTest({
        error: error.message,
        success: false
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration & API Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Frontend Configuration</h2>
          {configData ? (
            <div className="space-y-2">
              <div>
                <strong>API Base URL:</strong> 
                <span className={`ml-2 ${configData.apiBaseUrl?.includes('8080') ? 'text-green-600' : 'text-red-600'}`}>
                  {configData.apiBaseUrl}
                </span>
              </div>
              <div>
                <strong>API Timeout:</strong> 
                <span className="ml-2">{configData.apiTimeout}ms</span>
              </div>
              <div>
                <strong>Site Name:</strong> 
                <span className="ml-2">{configData.siteName}</span>
              </div>
              <div>
                <strong>Site URL:</strong> 
                <span className="ml-2">{configData.siteUrl}</span>
              </div>
            </div>
          ) : (
            <p>Loading configuration...</p>
          )}
        </div>

        {/* API Test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
          {apiTest ? (
            <div className="space-y-4">
              {apiTest.error ? (
                <div className="text-red-600">
                  <strong>❌ Connection Failed:</strong>
                  <p>{apiTest.error}</p>
                </div>
              ) : (
                <>
                  {/* Health Check */}
                  <div>
                    <strong>Health Check:</strong>
                    <span className={`ml-2 ${apiTest.health?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {apiTest.health?.success ? '✅ Success' : '❌ Failed'}
                    </span>
                    {apiTest.health?.data && (
                      <div className="text-sm text-gray-600 mt-1">
                        Status: {apiTest.health.data.status}
                      </div>
                    )}
                  </div>

                  {/* Airport Search */}
                  <div>
                    <strong>Airport Search:</strong>
                    <span className={`ml-2 ${apiTest.search?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {apiTest.search?.success ? '✅ Success' : '❌ Failed'}
                    </span>
                    {apiTest.search?.data && (
                      <div className="text-sm text-gray-600 mt-1">
                        Found: {apiTest.search.data.data?.length || 0} airports
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p>Testing API connection...</p>
          )}
        </div>
      </div>

      {/* Raw Data */}
      {apiTest && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Raw API Response:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(apiTest, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <button 
          onClick={testApiConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry API Test
        </button>
      </div>
    </div>
  );
}