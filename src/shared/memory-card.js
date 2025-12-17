const MC_CACHE = new Map();

class MemoryCard {
    static #instance = null;
    static #isInitializing = false;

    constructor(slot = 1, gameDir = "ROR") {
        if (MemoryCard.#instance) {
            console.warn(`MemoryCard já existe! Retornando instância slot ${MemoryCard.#instance.slot}`);
            return MemoryCard.#instance;
        }

        if (MemoryCard.#isInitializing) {
            throw new Error("MemoryCard está sendo inicializado em outro contexto");
        }

        MemoryCard.#isInitializing = true;

        if (slot !== 1 && slot !== 2) {
            throw new RangeError(`Slot inválido: ${slot}. Use 1 ou 2 (mc0:/ ou mc1:/)`);
        }

        this.slot = slot;
        this.gameDir = gameDir;
        this.mcPath = `mc${slot - 1}:/`;
        this.gamePath = `${this.mcPath}${gameDir}/`;

        this._operationQueue = [];
        this._isProcessing = false;

        this.config = {
            maxRetries: 3,
            retryDelay: 100,
            useAsyncCopy: true,
            cacheTimeout: 5000
        };

        this._initPromise = this._initializeAsync();

        MemoryCard.#instance = this;
        MemoryCard.#isInitializing = false;
    }

    static get instance() {
        if (!MemoryCard.#instance) {
            throw new Error("MemoryCard não inicializado. Chame new MemoryCard() primeiro");
        }
        return MemoryCard.#instance;
    }

    async _initializeAsync() {
        try {
            console.log(`[MC] Inicializando slot ${this.slot}...`);
            const ok = await this._checkMemoryCardAsync();
            if (!ok) {
                console.warn(`[MC] Slot ${this.slot} não está pronto`);
            }
            console.log(`[MC] Inicializado: ${this.gamePath}`);
        } catch (e) {
            console.error(`[MC] Erro na inicialização: ${e.message}`);
        }
    }

    async _checkMemoryCardAsync() {
        const cacheKey = `mc${this.slot}`;
        const cached = MC_CACHE.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < this.config.cacheTimeout)) {
            return cached.status;
        }

        let retries = 0;
        while (retries < this.config.maxRetries) {
            try {
                const mcInfo = System.getMCInfo(this.slot - 1);

                if (mcInfo.type === 0) {
                    console.warn(`[MC] Memory Card no slot ${this.slot} não reconhecido`);
                    return false;
                }

                if (mcInfo.format === 0) {
                    console.warn(`[MC] Memory Card no slot ${this.slot} não formatado`);
                    return false;
                }

                MC_CACHE.set(cacheKey, {
                    status: true,
                    timestamp: Date.now()
                });

                return true;
            } catch (e) {
                retries++;
                console.warn(`[MC] Tentativa ${retries} falhou: ${e.message}`);
                if (retries < this.config.maxRetries) {
                    await this._sleep(this.config.retryDelay * retries);
                }
            }
        }

        MC_CACHE.set(cacheKey, {
            status: false,
            timestamp: Date.now()
        });

        return false;
    }

    _sleep(ms) {
        return new Promise(resolve => os.setTimeout(resolve, ms));
    }

    async ready() {
        await this._initPromise;
        return true;
    }

    async createGameDirectory() {
        await this.ready();

        if (!(await this._checkMemoryCardAsync())) {
            console.error(`[MC] Não pode criar diretório: MC não pronto`);
            return false;
        }

        if (await this._checkFileExistsAsync(this.gamePath)) {
            console.log(`[MC] Diretório já existe: ${this.gamePath}`);
            return true;
        }

        console.log(`[MC] Criando diretório: ${this.gamePath}`);

        let retries = 0;
        while (retries < this.config.maxRetries) {
            const result = os.mkdir(this.gamePath, 0o777);

            if (result === 0 || result === -os.EEXIST) {
                console.log(`[MC] Diretório criado: ${this.gamePath}`);

                await this._copyIconFilesAsync();
                return true;
            }

            retries++;
            console.warn(`[MC] Falha ao criar dir (tentativa ${retries}): ${result}`);
            await this._sleep(this.config.retryDelay * retries);
        }

        return false;
    }

    async _copyIconFilesAsync() {
        const iconFiles = [
            ["assets/icons/ror.icn", `${this.gamePath}ror.icn`],
            ["assets/icons/rordelete.icn", `${this.gamePath}rordelete.icn`],
            ["assets/icons/icon.sys", `${this.gamePath}icon.sys`]
        ];

        for (const [src, dest] of iconFiles) {
            try {
                if (this.config.useAsyncCopy && System.threadCopyFile) {
                    System.threadCopyFile(src, dest);
                    console.log(`[MC] Cópia async iniciada: ${src} → ${dest}`);
                } else {
                    System.copyFile(src, dest);
                    console.log(`[MC] Cópia sync: ${src} → ${dest}`);
                }

                await this._sleep(10);
            } catch (e) {
                console.error(`[MC] Erro ao copiar ícone: ${e.message}`);
            }
        }
    }

    async saveGame(data, fileName = "savegame.dat") {
        await this.ready();

        if (!(await this._checkMemoryCardAsync())) {
            console.error(`[MC] Não pode salvar: MC não pronto`);
            return false;
        }

        await this.createGameDirectory();

        const fullPath = `${this.gamePath}${fileName}`;
        console.log(`[MC] Salvando: ${fullPath}`);

        const saveData = {
            ...data,
            _version: "1.0",
            _timestamp: Date.now(),
            _checksum: this._calculateChecksum(data)
        };

        let retries = 0;
        while (retries < this.config.maxRetries) {
            try {
                const file = std.open(fullPath, "w");
                if (!file) throw new Error(`Falha ao abrir arquivo: ${fullPath}`);

                file.puts(JSON.stringify(saveData));
                file.flush();
                file.close();

                console.log(`[MC] Save concluído: ${fullPath}`);
                return true;
            } catch (e) {
                retries++;
                console.error(`[MC] Save falhou (tentativa ${retries}): ${e.message}`);
                if (retries < this.config.maxRetries) {
                    await this._sleep(this.config.retryDelay * retries);
                }
            }
        }

        return false;
    }

    async loadGame(fileName = "savegame.dat") {
        await this.ready();

        if (!(await this._checkMemoryCardAsync())) {
            console.error(`[MC] Não pode carregar: MC não pronto`);
            return null;
        }

        const fullPath = `${this.gamePath}${fileName}`;

        if (!(await this._checkFileExistsAsync(fullPath))) {
            console.log(`[MC] Save não encontrado: ${fullPath}`);
            return null;
        }

        let retries = 0;
        while (retries < this.config.maxRetries) {
            try {
                const file = std.open(fullPath, "r");
                const content = file.readAsString();
                file.close();

                const saveData = JSON.parse(content);

                if (!this._validateChecksum(saveData)) {
                    console.error(`[MC] Save corrompido: ${fullPath}`);
                    return null;
                }

                console.log(`[MC] Load concluído: ${fullPath}`);

                const { _version, _timestamp, _checksum, ...data } = saveData;
                return data;
            } catch (e) {
                retries++;
                console.error(`[MC] Load falhou (tentativa ${retries}): ${e.message}`);
                if (retries < this.config.maxRetries) {
                    await this._sleep(this.config.retryDelay * retries);
                }
            }
        }

        return null;
    }

    async _checkFileExistsAsync(filePath) {
        const cacheKey = `file:${filePath}`;
        const cached = MC_CACHE.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < 1000)) {
            return cached.status;
        }

        try {
            const exists = std.exists(filePath);
            MC_CACHE.set(cacheKey, {
                status: exists,
                timestamp: Date.now()
            });
            return exists;
        } catch (e) {
            return false;
        }
    }

    checkFileExists(filePath) {
        return std.exists(filePath);
    }

    async deleteSave(fileName = "savegame.dat") {
        await this.ready();

        if (!(await this._checkMemoryCardAsync())) {
            console.error(`[MC] Não pode deletar: MC não pronto`);
            return false;
        }

        const fullPath = `${this.gamePath}${fileName}`;

        if (!(await this._checkFileExistsAsync(fullPath))) {
            console.log(`[MC] Save não existe: ${fullPath}`);
            return false;
        }

        let retries = 0;
        while (retries < this.config.maxRetries) {
            const result = os.remove(fullPath);

            if (result === 0) {
                console.log(`[MC] Save deletado: ${fullPath}`);
                return true;
            }

            retries++;
            console.warn(`[MC] Delete falhou (tentativa ${retries}): ${result}`);
            await this._sleep(this.config.retryDelay * retries);
        }

        return false;
    }

    async listSaves() {
        await this.ready();

        if (!(await this._checkMemoryCardAsync())) return [];

        if (!(await this._checkFileExistsAsync(this.gamePath))) {
            return [];
        }

        try {
            const files = System.listDir(this.gamePath);
            return files
                .filter(file => !file.directory && file.name.endsWith('.dat'))
                .map(file => file.name);
        } catch (e) {
            console.error(`[MC] Erro ao listar saves: ${e.message}`);
            return [];
        }
    }

    listSavesSync() {
        try {
            const files = System.listDir(this.gamePath);
            return files
                .filter(file => !file.directory && file.name.endsWith('.dat'))
                .map(file => file.name);
        } catch (e) {
            return [];
        }
    }

    _calculateChecksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    _validateChecksum(saveData) {
        if (!saveData._checksum) return false;
        const { _checksum, ...data } = saveData;
        return this._calculateChecksum(data) === _checksum;
    }

    async getMemoryCardInfo() {
        const cacheKey = `info:${this.slot}`;
        const cached = MC_CACHE.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < this.config.cacheTimeout)) {
            return cached.data;
        }

        try {
            const info = System.getMCInfo(this.slot - 1);
            MC_CACHE.set(cacheKey, {
                data: info,
                timestamp: Date.now()
            });
            return info;
        } catch (e) {
            return { type: 0, freemem: 0, format: 0 };
        }
    }

    async getFreeSpaceKB() {
        const info = await this.getMemoryCardInfo();
        return Math.floor(info.freemem / 1024);
    }
}

export default MemoryCard;