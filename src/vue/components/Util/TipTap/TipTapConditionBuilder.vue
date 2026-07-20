<template>
  <div class="condition-builder" contenteditable="false">
    <!-- STRUCTURED MODE -->
    <template v-if="mode === 'structured'">
      <div v-for="(row, i) in rows" :key="i" class="cb-row">
        <select v-if="i > 0" class="cb-connector" :value="connector" @change="setConnector($event.target.value)">
          <option value="and">and</option>
          <option value="or">or</option>
        </select>
        <span v-else class="cb-connector cb-connector--lead"></span>

        <input
            class="cb-var"
            type="text"
            list="cb-variables"
            :value="row.variable"
            placeholder="variable"
            @input="patch(i, { variable: $event.target.value })"
        />

        <select class="cb-op" :value="row.operator" @change="patch(i, { operator: $event.target.value })">
          <option v-for="op in OPERATORS" :key="op" :value="op">{{ op }}</option>
        </select>

        <template v-if="!isUnary(row.operator)">
          <input class="cb-val" type="text" list="cb-variables"
                 :value="row.value" placeholder="value"
                 @input="patch(i, { value: $event.target.value })" />
        </template>

        <button type="button" class="cb-x" title="Remove" @click="removeRow(i)">×</button>
      </div>

      <datalist id="cb-variables">
        <option v-for="v in variables" :key="v.name" :value="v.name" />
      </datalist>

      <div class="cb-actions">
        <button type="button" @click="addRow">+</button>
        <button type="button" class="cb-raw-toggle" @click="toRaw">edit raw</button>
      </div>
    </template>

    <!-- RAW MODE (escape hatch) -->
    <template v-else>
      <textarea class="cb-rawfield" rows="2" :value="raw" placeholder="raw Twig expression"
                @input="onRaw($event.target.value)" />
      <div class="cb-actions">
        <button type="button" :disabled="!rawParses" :title="rawParses ? '' : 'Too complex for the builder'"
                @click="toStructured">use builder</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  findValueType,
  isUnary,
  parseCondition,
  serializeCondition,
  OPERATORS,
  VALUE_TYPES,
} from '../../../functions/TipTap/condition';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  variables: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const mode = ref('structured');
const connector = ref('and');
const rows = ref([]);
const raw = ref('');
const rawParses = ref(true);

let lastEmitted = null;

const loadFrom = (string) => {
  const parsed = parseCondition(string);
  if (parsed.ok) {
    mode.value = 'structured';
    connector.value = parsed.connector;
    rows.value = parsed.rows.map((row) => ({ ...row }));
    if (parsed.rows.length) {
      rows.value = parsed.rows.map((row) => ({...row}));
    } else {
      rows.value = [{
        variable: '',
        operator: '==',
        value: '',
        valueType: 'string',
      }];
    }
  } else {
    mode.value = 'raw';
    raw.value = string;
  }
};

watch(() => props.modelValue, (value) => {
 if (value === lastEmitted) {
   // ignore our own echo
   return;
 }
 loadFrom(value ?? '');
}, { immediate: true });

const emitStructured = () => {
  const string = serializeCondition(connector.value, rows.value);
  lastEmitted = string;
  emit('update:modelValue', string);
};

const newRow = () => {
  return {
    variable: '',
    operator: '==',
    value: '',
    valueType: 'string',
  }
}

const patch = (i, changes) => {
  const next = { ...rows.value[i], ...changes };
  if ('value' in changes && !isUnary(next.operator)) {
    next.valueType = findValueType(changes.value, props.variables);
  }
  rows.value[i] = next;
  emitStructured();
};

const addRow = () => {
  rows.value.push(newRow());
  emitStructured();
};

const removeRow = (i) => {
  rows.value.splice(i, 1);
  emitStructured();
};

const setConnector = (newConnector) => {
  connector.value = newConnector;
  emitStructured();
}

const toRaw = () => {
  raw.value = serializeCondition(connector.value, rows.value);
  mode.value = 'raw';
};

const onRaw = (value) => {
  raw.value = value;
  rawParses.value = parseCondition(value).ok;
  lastEmitted = value;
  emit('update:modelValue', value);
}

const toStructured = () => {
  const parsed = parseCondition(raw.value);
  if (!parsed.ok) {
    return;
  }
  connector.value = parsed.connector;
  rows.value = parsed.rows.map((row) => ({ ...row }));
  mode.value = 'structured';
  emitStructured();
};
</script>
<style>
.condition-builder {
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;

  .cb-row {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .cb-connector {
    width: 4rem;
  }
  .cb-connector--lead {
    color: rgb(107 114 128);
    font-style: italic;
  }

  .cb-var, .cb-val {
    flex: 0 1 9rem;
    padding: 0.1rem 0.35rem;
    border: 1px solid rgb(199 210 254);
    border-radius: 4px;
  }

  .cb-op, .cb-type {
    padding: 0.1rem 0.2rem;
    border: 1px solid rgb(199 210 254);
    border-radius: 4px;
  }

  .cb-x {
    border: none;
    background: transparent;
    cursor: pointer;
    color: rgb(107 114 128);
    font-size: 1rem; }

  .cb-actions {
    display: flex;
    gap: 0.5rem;
  }

  .cb-actions button {
    font-size: 0.75rem;
    padding: 0.1rem 0.5rem;
    border: 1px solid rgb(199 210 254);
    border-radius: 4px;
    background: white;
    cursor: pointer;
  }

  .cb-actions button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .cb-raw-toggle {
    color: rgb(107 114 128);
  }

  .cb-rawfield {
    width: 100%;
    box-sizing: border-box;
    min-width: 18rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8rem;
    border: 1px solid rgb(199 210 254);
    border-radius: 4px;
    padding: 0.25rem;
  }
}
</style>