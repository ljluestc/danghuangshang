/**
 * Docker init 命令兼容性回归测试（Issue #67）
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

describe('Docker init command compatibility', () => {
  const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
  const initScriptPath = path.join(__dirname, '..', 'docker', 'init-docker.sh');

  it('Dockerfile should expose slashless init aliases in PATH', () => {
    const dockerfile = fs.readFileSync(dockerfilePath, 'utf-8');

    assert(
      dockerfile.includes('ln -sf /init-docker.sh /usr/local/bin/init-court'),
      'Dockerfile should provide /usr/local/bin/init-court alias',
    );
    assert(
      dockerfile.includes('ln -sf /init-docker.sh /usr/local/bin/init-docker.sh'),
      'Dockerfile should provide /usr/local/bin/init-docker.sh alias',
    );
  });

  it('init script usage should recommend slashless command for compose exec/run', () => {
    const script = fs.readFileSync(initScriptPath, 'utf-8');

    assert(
      script.includes('docker compose exec court init-court'),
      'init script should recommend docker compose exec court init-court',
    );
    assert(
      script.includes('docker compose run --rm court init-court'),
      'init script should recommend docker compose run --rm court init-court',
    );
    assert(
      !script.includes('docker compose exec court /init-docker.sh'),
      'init script should avoid slash-prefixed path in compose exec guidance',
    );
  });
});
