'use client';

import { designTokens } from '@/lib/design-validation';

interface StyleGuideProps {
  showInProduction?: boolean;
}

export default function StyleGuide({ showInProduction = false }: StyleGuideProps) {
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brand-blue mb-4">Design System Style Guide</h1>
        <p className="text-lg text-gray-600">Visual validation of design tokens and components</p>
      </div>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Brand Colors</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Primary - Brand Red</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(designTokens.colors.primary).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: value as string }}
                  ></div>
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-xs text-gray-500">{value as string}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Secondary - Brand Blue</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(designTokens.colors.secondary).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: value as string }}
                  ></div>
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-xs text-gray-500">{value as string}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Accent - Brand Orange</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(designTokens.colors.accent).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: value as string }}
                  ></div>
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-xs text-gray-500">{value as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Typography</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Font Families</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-poppins text-2xl font-bold mb-2">Poppins - Headings</div>
                <div className="text-sm text-gray-600">Used for all headings (h1-h6)</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-nunito text-lg mb-2">Nunito Sans - Body Text</div>
                <div className="text-sm text-gray-600">Used for body text and UI elements</div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="font-inter text-lg mb-2">Inter - Alternative</div>
                <div className="text-sm text-gray-600">Used for specific UI components</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Font Sizes</h3>
            <div className="space-y-2">
              {Object.entries(designTokens.typography.fontSizes).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4 p-2">
                  <div className="w-16 text-sm text-gray-500">{key}</div>
                  <div className="w-20 text-sm text-gray-500">{value}</div>
                  <div style={{ fontSize: value }}>Sample text in {key} size</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Spacing Scale</h2>
        <div className="space-y-2">
          {Object.entries(designTokens.spacing).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-500">{key}</div>
              <div className="w-20 text-sm text-gray-500">{value}</div>
              <div 
                className="bg-brand-red h-4"
                style={{ width: value }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Shadows</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(designTokens.shadows).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-24 bg-white rounded-lg mb-3 flex items-center justify-center"
                style={{ boxShadow: value }}
              >
                <span className="text-gray-600 font-medium">{key}</span>
              </div>
              <div className="text-sm text-gray-500">{key}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Border Radius</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(designTokens.borderRadius).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-16 bg-brand-red-100 mb-2 flex items-center justify-center"
                style={{ borderRadius: value }}
              >
                <span className="text-brand-red font-medium text-sm">{key}</span>
              </div>
              <div className="text-sm text-gray-500">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Component Examples */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Component Examples</h2>
        
        <div className="space-y-8">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <button className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200">
                Primary Button
              </button>
              <button className="bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200">
                Secondary Button
              </button>
              <button className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-200">
                Outline Button
              </button>
              <button className="text-brand-blue hover:text-brand-red px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Ghost Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-bold text-lg mb-2">Card Title</h4>
                <p className="text-gray-600">This is a sample card with consistent styling.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="font-bold text-lg mb-2">Hover Card</h4>
                <p className="text-gray-600">This card has hover effects applied.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-brand-red">
                <h4 className="font-bold text-lg mb-2">Accent Card</h4>
                <p className="text-gray-600">This card has a brand accent border.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Breakpoints */}
      <section>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Responsive Breakpoints</h2>
        <div className="space-y-2">
          {Object.entries(designTokens.breakpoints).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-16 text-sm font-medium">{key}</div>
              <div className="w-20 text-sm text-gray-600">{value}</div>
              <div className="text-sm text-gray-600">
                {key === 'xs' && 'Extra small devices'}
                {key === 'sm' && 'Small devices (landscape phones)'}
                {key === 'md' && 'Medium devices (tablets)'}
                {key === 'lg' && 'Large devices (desktops)'}
                {key === 'xl' && 'Extra large devices'}
                {key === '2xl' && 'Extra extra large devices'}
                {key === '3xl' && 'Ultra wide devices'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}