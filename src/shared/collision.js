class Collision {
    static #instance;

    constructor() {
        if (Collision.#instance) return Collision.#instance;
        Collision.#instance = this;
        
        this.colliders = new Map();
        this.staticColliders = new Map();
        this.layers = new Map();
        this.nextId = 0;
        this.spatialGrid = null;
        this.gridSize = 64;
        this.debugMode = false;
        this.debugColors = {
            dynamic: Color.new(0, 255, 0, 100),
            static: Color.new(255, 0, 0, 100),
            active: Color.new(255, 255, 0, 150)
        };
        this.activeCollisions = new Set();
    }

    register(config) {
        const id = this.nextId++;
        const collider = {
            id,
            type: config.type || 'rect',
            x: config.x || 0,
            y: config.y || 0,
            w: config.w || 0,
            h: config.h || 0,
            r: config.r || 0,
            static: config.static || false,
            layer: config.layer || 'default',
            mask: config.mask || ['default'],
            tags: config.tags || [],
            onCollision: config.onCollision,
            data: config.data || {}
        };

        const storage = collider.static ? this.staticColliders : this.colliders;
        storage.set(id, collider);

        if (!this.layers.has(collider.layer)) {
            this.layers.set(collider.layer, new Set());
        }
        this.layers.get(collider.layer).add(id);

        return id;
    }

    unregister(id) {
        const collider = this.get(id);
        if (!collider) return false;

        const storage = collider.static ? this.staticColliders : this.colliders;
        storage.delete(id);

        const layerSet = this.layers.get(collider.layer);
        if (layerSet) {
            layerSet.delete(id);
            if (layerSet.size === 0) this.layers.delete(collider.layer);
        }

        return true;
    }

    get(id) {
        return this.colliders.get(id) || this.staticColliders.get(id);
    }

    update(id, props) {
        const collider = this.get(id);
        if (!collider) return false;

        Object.assign(collider, props);
        return true;
    }

    check() {
        this.activeCollisions.clear();
        
        const dynamics = [...this.colliders.values()];
        const statics = [...this.staticColliders.values()];

        for (let i = 0; i < dynamics.length; i++) {
            for (let j = i + 1; j < dynamics.length; j++) {
                this.#testPair(dynamics[i], dynamics[j]);
            }
        }

        for (const dyn of dynamics) {
            for (const sta of statics) {
                this.#testPair(dyn, sta);
            }
        }
    }

    checkOne(id, mask = null) {
        const target = this.get(id);
        if (!target) return [];

        const hits = [];
        const checkMask = mask || target.mask;

        for (const other of [...this.colliders.values(), ...this.staticColliders.values()]) {
            if (other.id === id) continue;
            if (!checkMask.includes(other.layer)) continue;

            if (this.test(target, other)) {
                hits.push({
                    id: other.id,
                    collider: other,
                    type: other.type,
                    layer: other.layer,
                    tags: other.tags,
                    data: other.data
                });
            }
        }

        return hits;
    }

    checkArea(config) {
        const area = {
            type: config.type || 'rect',
            x: config.x || 0,
            y: config.y || 0,
            w: config.w || 0,
            h: config.h || 0,
            r: config.r || 0
        };

        const mask = config.mask || ['default'];
        const hits = [];

        for (const collider of [...this.colliders.values(), ...this.staticColliders.values()]) {
            if (!mask.includes(collider.layer)) continue;
            if (config.excludeId && collider.id === config.excludeId) continue;

            if (this.test(area, collider)) {
                hits.push({
                    id: collider.id,
                    collider,
                    type: collider.type,
                    layer: collider.layer,
                    tags: collider.tags,
                    data: collider.data
                });
            }
        }

        return hits;
    }

    test(a, b) {
        if (a.type === 'rect' && b.type === 'rect') {
            return this.#rectRect(a, b);
        }
        if (a.type === 'circle' && b.type === 'circle') {
            return this.#circleCircle(a, b);
        }
        if (a.type === 'rect' && b.type === 'circle') {
            return this.#rectCircle(a, b);
        }
        if (a.type === 'circle' && b.type === 'rect') {
            return this.#rectCircle(b, a);
        }
        return false;
    }

    raycast(x1, y1, x2, y2, mask = ['default']) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const dirX = dx / len;
        const dirY = dy / len;

        let closest = null;
        let minDist = Infinity;

        for (const c of [...this.colliders.values(), ...this.staticColliders.values()]) {
            if (!mask.includes(c.layer)) continue;

            const hit = this.#raycastShape(x1, y1, dirX, dirY, len, c);
            if (hit && hit.distance < minDist) {
                minDist = hit.distance;
                closest = { ...hit, id: c.id, collider: c };
            }
        }

        return closest;
    }

    resolve(a, b) {
        if (a.type === 'rect' && b.type === 'rect') {
            return this.#resolveRectRect(a, b);
        }
        if (a.type === 'circle' && b.type === 'circle') {
            return this.#resolveCircleCircle(a, b);
        }
        if (a.type === 'rect' && b.type === 'circle') {
            const mtv = this.#resolveRectCircle(a, b);
            return mtv ? { x: -mtv.x, y: -mtv.y } : null;
        }
        if (a.type === 'circle' && b.type === 'rect') {
            return this.#resolveRectCircle(b, a);
        }
        return null;
    }

    toggleDebug() {
        this.debugMode = !this.debugMode;
        return this.debugMode;
    }

    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    renderDebug() {
        if (!this.debugMode) return;

        for (const collider of this.staticColliders.values()) {
            this.#drawCollider(collider, this.debugColors.static);
        }

        for (const collider of this.colliders.values()) {
            const isActive = this.activeCollisions.has(collider.id);
            const color = isActive ? this.debugColors.active : this.debugColors.dynamic;
            this.#drawCollider(collider, color);
        }
    }

    #drawCollider(collider, color) {
        if (collider.type === 'rect') {
            Draw.rect(collider.x, collider.y, collider.w, collider.h, color);
            
            Draw.line(collider.x, collider.y, collider.x + collider.w, collider.y, color);
            Draw.line(collider.x + collider.w, collider.y, collider.x + collider.w, collider.y + collider.h, color);
            Draw.line(collider.x + collider.w, collider.y + collider.h, collider.x, collider.y + collider.h, color);
            Draw.line(collider.x, collider.y + collider.h, collider.x, collider.y, color);
        } else if (collider.type === 'circle') {
            Draw.circle(collider.x, collider.y, collider.r, color, true);
            
            const outlineColor = Color.new(
                Color.getR(color),
                Color.getG(color),
                Color.getB(color),
                255
            );
            Draw.circle(collider.x, collider.y, collider.r, outlineColor, false);
        }
    }

    #testPair(a, b) {
        if (!this.#canCollide(a, b)) return;

        if (this.test(a, b)) {
            this.activeCollisions.add(a.id);
            this.activeCollisions.add(b.id);
            
            a.onCollision?.(b);
            b.onCollision?.(a);
        }
    }

    #canCollide(a, b) {
        return a.mask.includes(b.layer) || b.mask.includes(a.layer);
    }

    #rectRect(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }

    #circleCircle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        const radSum = a.r + b.r;
        return distSq < radSum * radSum;
    }

    #rectCircle(rect, circle) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        return (dx * dx + dy * dy) < (circle.r * circle.r);
    }

    #resolveRectRect(a, b) {
        const overlapX1 = (a.x + a.w) - b.x;
        const overlapX2 = (b.x + b.w) - a.x;
        const overlapY1 = (a.y + a.h) - b.y;
        const overlapY2 = (b.y + b.h) - a.y;

        const minX = Math.min(overlapX1, overlapX2);
        const minY = Math.min(overlapY1, overlapY2);

        if (minX < minY) {
            return { x: overlapX1 < overlapX2 ? -minX : minX, y: 0 };
        }
        return { x: 0, y: overlapY1 < overlapY2 ? -minY : minY };
    }

    #resolveCircleCircle(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const overlap = (a.r + b.r) - dist;

        if (dist === 0) return { x: a.r + b.r, y: 0 };

        return {
            x: (dx / dist) * overlap,
            y: (dy / dist) * overlap
        };
    }

    #resolveRectCircle(rect, circle) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
        const dx = circle.x - closestX;
        const dy = circle.y - closestY;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) {
            const dLeft = circle.x - rect.x;
            const dRight = (rect.x + rect.w) - circle.x;
            const dTop = circle.y - rect.y;
            const dBottom = (rect.y + rect.h) - circle.y;
            const min = Math.min(dLeft, dRight, dTop, dBottom);

            if (min === dLeft) return { x: -(circle.r + dLeft), y: 0 };
            if (min === dRight) return { x: circle.r + dRight, y: 0 };
            if (min === dTop) return { x: 0, y: -(circle.r + dTop) };
            return { x: 0, y: circle.r + dBottom };
        }

        const overlap = circle.r - dist;
        return {
            x: (dx / dist) * overlap,
            y: (dy / dist) * overlap
        };
    }

    #raycastShape(x, y, dirX, dirY, maxLen, shape) {
        if (shape.type === 'rect') {
            return this.#raycastRect(x, y, dirX, dirY, maxLen, shape);
        }
        if (shape.type === 'circle') {
            return this.#raycastCircle(x, y, dirX, dirY, maxLen, shape);
        }
        return null;
    }

    #raycastRect(x, y, dirX, dirY, maxLen, rect) {
        const tMin = {
            x: (rect.x - x) / dirX,
            y: (rect.y - y) / dirY
        };
        const tMax = {
            x: (rect.x + rect.w - x) / dirX,
            y: (rect.y + rect.h - y) / dirY
        };

        const t1 = { x: Math.min(tMin.x, tMax.x), y: Math.min(tMin.y, tMax.y) };
        const t2 = { x: Math.max(tMin.x, tMax.x), y: Math.max(tMin.y, tMax.y) };

        const tNear = Math.max(t1.x, t1.y);
        const tFar = Math.min(t2.x, t2.y);

        if (tNear > tFar || tFar < 0 || tNear > maxLen) return null;

        const distance = tNear >= 0 ? tNear : 0;
        return {
            distance,
            point: { x: x + dirX * distance, y: y + dirY * distance },
            normal: this.#getRectNormal(x, y, dirX, dirY, distance, rect)
        };
    }

    #raycastCircle(x, y, dirX, dirY, maxLen, circle) {
        const dx = x - circle.x;
        const dy = y - circle.y;
        const a = dirX * dirX + dirY * dirY;
        const b = 2 * (dx * dirX + dy * dirY);
        const c = dx * dx + dy * dy - circle.r * circle.r;
        const disc = b * b - 4 * a * c;

        if (disc < 0) return null;

        const t = (-b - Math.sqrt(disc)) / (2 * a);
        if (t < 0 || t > maxLen) return null;

        const px = x + dirX * t;
        const py = y + dirY * t;
        const nx = (px - circle.x) / circle.r;
        const ny = (py - circle.y) / circle.r;

        return {
            distance: t,
            point: { x: px, y: py },
            normal: { x: nx, y: ny }
        };
    }

    #getRectNormal(x, y, dirX, dirY, t, rect) {
        const px = x + dirX * t;
        const py = y + dirY * t;
        const eps = 0.001;

        if (Math.abs(px - rect.x) < eps) return { x: -1, y: 0 };
        if (Math.abs(px - (rect.x + rect.w)) < eps) return { x: 1, y: 0 };
        if (Math.abs(py - rect.y) < eps) return { x: 0, y: -1 };
        if (Math.abs(py - (rect.y + rect.h)) < eps) return { x: 0, y: 1 };

        return { x: 0, y: 0 };
    }

    clear() {
        this.colliders.clear();
        this.staticColliders.clear();
        this.layers.clear();
        this.activeCollisions.clear();
    }

    getByLayer(layer) {
        const ids = this.layers.get(layer);
        if (!ids) return [];
        return [...ids].map(id => this.get(id)).filter(Boolean);
    }

    getByTag(tag) {
        return [...this.colliders.values(), ...this.staticColliders.values()]
            .filter(c => c.tags.includes(tag));
    }
}

export default new Collision();