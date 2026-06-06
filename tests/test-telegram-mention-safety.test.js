/**
 * Telegram 多 Bot @mention 安全默认值回归测试
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Telegram mention safety defaults', () => {
  const exampleConfigPath = path.join(__dirname, '..', 'openclaw.example.json');
  const dockerInitPath = path.join(__dirname, '..', 'docker', 'init-docker.sh');

  it('openclaw.example.json should include telegram group requireMention=true', () => {
    const config = JSON.parse(fs.readFileSync(exampleConfigPath, 'utf-8'));

    assert(config.channels, 'channels should exist');
    assert(config.channels.telegram, 'telegram channel config should exist');
    assert(config.channels.telegram.groups, 'telegram groups config should exist');
    assert(config.channels.telegram.groups['-1001234567890'], 'default telegram group template should exist');
    assert.strictEqual(
      config.channels.telegram.groups['-1001234567890'].requireMention,
      true,
      'telegram group template should require explicit mention by default',
    );
  });

  it('openclaw.example.json should not include global @everyone/@here mention patterns', () => {
    const config = JSON.parse(fs.readFileSync(exampleConfigPath, 'utf-8'));
    const patterns = config?.messages?.groupChat?.mentionPatterns;

    assert(Array.isArray(patterns), 'messages.groupChat.mentionPatterns should be an array');
    assert.deepStrictEqual(
      patterns,
      [],
      'global mention patterns should be empty to avoid multi-bot accidental trigger',
    );
  });

  it('docker init template should generate empty mentionPatterns', () => {
    const script = fs.readFileSync(dockerInitPath, 'utf-8');

    assert(
      /"mentionPatterns":\s*\[\s*\]/.test(script),
      'docker init should generate empty mentionPatterns list',
    );
    assert(
      !/"mentionPatterns":\s*\["\s*@everyone\s*",\s*"\s*@here\s*"\s*\]/.test(script),
      'docker init should not inject @everyone/@here global mention patterns',
    );
  });
});
