<template>
  <div class="token-timeline">
    <careplan-timeline-block v-for="carePlan, index in carePlans" :key="index"
    :care-plan="carePlan" :open="index === 0" />
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';
import useCarePlanRepository from '../../functions/carePlanRepository';
import CareplanTimelineBlock from './CareplanTimelineBlock.vue';

export default {
  components: {
    CareplanTimelineBlock,
  },
  setup() {
    const carePlans = ref(null);

    const { getAllCarePlans } = useCarePlanRepository();

    const getCarePlans = (async () => {
      carePlans.value = await getAllCarePlans();
    });

    onMounted(() => {
      getCarePlans();
    });

    return {
      carePlans,
    };
  },
};
</script>
<style lang="scss">

.token-timeline {
  .careplan-timeline-block {
    .card-title {
      .action-icon {
        cursor: pointer;
        &:hover {
          color: rgb(128,128,128);
        }
      }
      .title-collapse {
        cursor: pointer;
      }
      span.title {
        cursor: pointer;
      }
    }
  }
  .measure-moment {
    width: 15.5rem;
    padding: .5rem;
    .start-date-block {
      .start-date {
        border-bottom: 1px solid;
      }
      .owner-type-title {
        cursor: pointer;
      }
      .item-legenda {
        padding: .75rem;
        .legenda-item {
          text-align: center;
        }
        .open {
          background-color: rgb(255,193,7);
          color: white;
        }
      }
      .token-items {
        .token-item {
          position: relative;
          overflow: hidden;
          word-wrap: break-word;
          padding: .25rem;
          &.open {
            border-left: 1rem rgb(255,193,7) solid;
          }
          .token-utils {
            padding-top: 0.2rem;
            text-align: right;
            .icon {
              cursor: pointer;
              margin: .2rem;
              color: rgba(49, 112, 143, 0.2);
              &:hover {
                color: #31708f;
              }
            }
          }
          .token-display {
            position: absolute;
            left: -101px;
          }
        }
      }
    }
  }
}
</style>
