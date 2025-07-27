// examples/react-example.jsx

import { useState, useCallback } from 'react';
import {
  generateKey,
  generateNumericKey,
  generateAlphaKey,
  generateShortKey,
  generateUUID,
  generateCustomKey,
  validateKey
} from '@neylorxt/generate-unique-key';

// Translations
const translations = {
  en: {
    title: '🎯 gererate-unique-key Demo',
    configuration: '⚙️ Configuration',
    keyType: 'Key Type',
    length: 'Length',
    separator: 'Separator',
    interval: 'Interval',
    generate: '🎲 Generate',
    quickGeneration: '🚀 Quick Generation',
    numeric: '🔢 Numeric',
    alphabetic: '🔤 Alphabetic',
    short: '⚡ Short',
    custom: '🏷️ Custom',
    validation: '✅ Validation',
    validateKey: 'Key to validate',
    validate: 'Validate',
    history: '📋 History',
    noKeys: 'No keys generated yet. Start by generating one!',
    copy: '📋 Copy',
    guide: '💡 User Guide',
    guideItems: [
      'Use configuration to customize your keys',
      'Quick generation buttons create keys with predefined formats',
      'Validate your keys in the validation section',
      'History keeps track of the last 10 generated keys',
      'Click "Copy" to copy a key'
    ],
    keyTypes: {
      default: 'Alphanumeric',
      number: 'Numeric',
      letter: 'Alphabetic'
    },
    copied: 'Key copied to clipboard!',
    copyError: 'Error copying to clipboard:',
    validateResult: 'Validation of "{key}":\n    - General: {general}\n    - Numeric: {numeric}\n    - Alphabetic: {alpha}'
  },
  fr: {
    title: '🎯 gererate-unique-key Demo',
    configuration: '⚙️ Configuration',
    keyType: 'Type de clé',
    length: 'Longueur',
    separator: 'Séparateur',
    interval: 'Intervalle',
    generate: '🎲 Générer',
    quickGeneration: '🚀 Génération Rapide',
    numeric: '🔢 Numérique',
    alphabetic: '🔤 Alphabétique',
    short: '⚡ Court',
    custom: '🏷️ Personnalisé',
    validation: '✅ Validation',
    validateKey: 'Clé à valider',
    validate: 'Valider',
    history: '📋 Historique',
    noKeys: 'Aucune clé générée. Commencez par en générer une !',
    copy: '📋 Copier',
    guide: '💡 Guide d\'utilisation',
    guideItems: [
      'Utilisez la configuration pour personnaliser vos clés',
      'Les boutons de génération rapide créent des clés avec des formats prédéfinis',
      'Validez vos clés dans la section validation',
      'L\'historique garde une trace des 10 dernières clés générées',
      'Cliquez sur "Copier" pour copier une clé'
    ],
    keyTypes: {
      default: 'Alphanumérique',
      number: 'Numérique',
      letter: 'Alphabétique'
    },
    copied: 'Clé copiée dans le presse-papiers !',
    copyError: 'Erreur lors de la copie :',
    validateResult: 'Validation de "{key}" :\n    - Général : {general}\n    - Numérique : {numeric}\n    - Alphabétique : {alpha}'
  }
};

// Styles constants
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  title: {
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginBottom: '30px',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  },
  configGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  input: {
    width: '90%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  quickButtons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
    marginTop: '15px',
  },
  keyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    marginBottom: '8px',
    flexWrap: 'nowrap' as const,
    gap: '10px',
  },
  code: {
    backgroundColor: '#e9ecef',
    padding: '5px 10px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  copyButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#5a6268',
    },
  },
};

type KeyEntry = {
  id: string;
  value: string;
  type: 'default' | 'number' | 'letter';
  timestamp: string;
};

// Composant principal de démonstration
function App() {
  const [lang, setLang] = useState<'en' | 'fr'>('en')
  const t = translations[lang];
  const [generatedKeys, setGeneratedKeys] = useState<KeyEntry[]>([]);
  const [customConfig, setCustomConfig] = useState<{
    type: 'default' | 'number' | 'letter';
    length: number;
    separator: string;
    separatorInterval: number;
  }>({
    type: 'default',
    length: 8,
    separator: '-',
    separatorInterval: 4,
  });

  const [validationInput, setValidationInput] = useState('');

  // Générer une nouvelle clé avec la configuration actuelle
  const generateNewKey = useCallback(() => {
    const newKey = generateKey({
      type: customConfig.type === 'default' ? 'default' : customConfig.type,
      length: customConfig.length, // Pas besoin de parseInt car déjà un nombre
      separator: customConfig.separator,
      separatorInterval: customConfig.separatorInterval // Pas besoin de parseInt car déjà un nombre
    });

    const keyEntry: KeyEntry = {
      id: generateShortKey(),
      value: newKey,
      type: customConfig.type,
      timestamp: new Date().toLocaleTimeString()
    };

    setGeneratedKeys(prev => [keyEntry, ...prev.slice(0, 9)]); // Garder les 10 derniers
  }, [customConfig]);

  // Générer des clés prédéfinies
  const generatePredefinedKey = useCallback((type: string) => {
    let newKey;
    let keyType: 'default' | 'number' | 'letter' = 'default';

    switch (type) {
      case 'numeric':
        newKey = generateNumericKey(10);
        keyType = 'number';
        break;
      case 'alpha':
        newKey = generateAlphaKey(12);
        keyType = 'letter';
        break;
      case 'uuid':
        newKey = generateUUID();
        keyType = 'default';
        break;
      case 'short':
        newKey = generateShortKey();
        keyType = 'default';
        break;
      case 'custom':
        newKey = generateCustomKey('APP_', '_2024', { length: 8, type: 'number' });
        keyType = 'number';
        break;
      default:
        newKey = generateKey();
        keyType = 'default';
    }

    const keyEntry: KeyEntry = {
      id: generateShortKey(),
      value: newKey,
      type: keyType,
      timestamp: new Date().toLocaleTimeString()
    };

    setGeneratedKeys(prev => [keyEntry, ...prev.slice(0, 9)]);
  }, []);

  // Copier une clé dans le presse-papiers
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t.copied);
    } catch (err) {
      console.error(t.copyError, err);
    }
  }, [t]);

  // Valider une clé
  const validateCurrentKey = useCallback(() => {
    const isValid = validateKey(validationInput);
    const isNumeric = validateKey(validationInput, 'number');
    const isAlpha = validateKey(validationInput, 'letter');

    alert(t.validateResult
        .replace('{key}', validationInput)
        .replace('{general}', isValid ? '✅' : '❌')
        .replace('{numeric}', isNumeric ? '✅' : '❌')
        .replace('{alpha}', isAlpha ? '✅' : '❌')
    );
  }, [validationInput, t]);

  return (
      <div style={styles.container}>
        <button
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '8px 16px',
              backgroundColor: '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
        >
          {lang === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
        </button>

        {/* 🔽 Ici le bouton vers NPM */}
        <a
            href="https://www.npmjs.com/package/@neylorxt/generate-unique-key"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#e67e22',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              transition: 'background-color 0.3s',
            }}
        >
          📦 View NPM Package
        </a>


        <h1 style={styles.title}>{t.title}</h1>

        {/* Section de Configuration */}
        <section style={styles.section}>
          <h2>{t.configuration}</h2>
          <div style={styles.configGrid}>
            <div>
              <label style={styles.label}>{t.keyType}</label>
              <select
                  style={{...styles.input, width: '100%'}}
                  value={customConfig.type}
                  onChange={(e) => setCustomConfig(prev => ({ ...prev, type: e.target.value as 'default' | 'number' | 'letter' }))}
              >
                <option value="default">{t.keyTypes.default}</option>
                <option value="number">{t.keyTypes.number}</option>
                <option value="letter">{t.keyTypes.letter}</option>
              </select>
            </div>

            <div>
              <label style={styles.label}>{t.length}</label>
              <input
                  type="number"
                  style={styles.input}
                  min="1"
                  max="50"
                  value={customConfig.length}
                  onChange={(e) => setCustomConfig(prev => ({ ...prev, length: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div>
              <label style={styles.label}>{t.separator}</label>
              <input
                  type="text"
                  style={styles.input}
                  maxLength={1}
                  value={customConfig.separator}
                  onChange={(e) => setCustomConfig(prev => ({ ...prev, separator: e.target.value }))}
              />
            </div>

            <div>
              <label style={styles.label}>{t.interval}</label>
              <input
                  type="number"
                  style={styles.input}
                  min="0"
                  max="20"
                  value={customConfig.separatorInterval}
                  onChange={(e) => setCustomConfig(prev => ({ ...prev, separatorInterval: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <button onClick={generateNewKey} style={styles.button}>
            {t.generate}
          </button>
        </section>

        {/* Section Génération Rapide */}
        <section style={styles.section}>
          <h2>{t.quickGeneration}</h2>
          <div style={styles.quickButtons}>
            {[
              { label: t.numeric, type: 'numeric' },
              { label: t.alphabetic, type: 'alpha' },
              { label: '🆔 UUID', type: 'uuid' },
              { label: t.short, type: 'short' },
              { label: t.custom, type: 'custom' }
            ].map(({ label, type }) => (
                <button
                    key={type}
                    onClick={() => generatePredefinedKey(type)}
                    style={{
                      ...styles.button,
                      backgroundColor: '#2ecc71',
                    }}
                >
                  {label}
                </button>
            ))}
          </div>
        </section>

        {/* Section Validation */}
        <section style={styles.section}>
          <h2>{t.validation}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: '10px',
            alignItems: 'end',
          }}>
            <div>
              <label style={styles.label}>{t.validateKey}</label>
              <input
                  type="text"
                  style={styles.input}
                  placeholder="Entrez une clé à valider..."
                  value={validationInput}
                  onChange={(e) => setValidationInput(e.target.value)}
              />
            </div>
            <button
                onClick={validateCurrentKey}
                style={{
                  ...styles.button,
                  backgroundColor: validationInput.trim() ? '#9b59b6' : '#bdc3c7',
                }}
                disabled={!validationInput.trim()}
            >
              {t.validate}
            </button>
          </div>
        </section>

        {/* Section Historique */}
        <section style={styles.section}>
          <h2>{t.history}</h2>
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '10px',
          }}>
            {generatedKeys.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                  {t.noKeys}
                </p>
            ) : (
                generatedKeys.map((entry) => (
                    <div key={entry.id} style={styles.keyItem}>
                      <div style={{ flex: 1 }}>
                        <code style={styles.code}>{entry.value}</code>
                        <span style={{
                          marginLeft: '10px',
                          color: '#666',
                          fontSize: '12px',
                        }}>
                                        {entry.type} • {entry.timestamp}
                                    </span>
                      </div>
                      <button
                          onClick={() => copyToClipboard(entry.value)}
                          style={styles.copyButton}
                      >
                        {t.copy}
                      </button>
                    </div>
                ))
            )}
          </div>
        </section>

        {/* Section Aide */}
        <section style={{
          ...styles.section,
          backgroundColor: '#f0f7ff',
          borderLeft: '4px solid #3498db',
        }}>
          <h2>{t.guide}</h2>
          <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
            {t.guideItems.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
  );
}

export default App;
