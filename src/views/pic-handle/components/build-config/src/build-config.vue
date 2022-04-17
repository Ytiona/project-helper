<template>
  <div class="block-wrap wrap">
    <div class="slide">
      <div class="types">
        <div
          v-for="(item, index) in buildTypes"
          :key="index"
          :class="[
            'type-item',
            { active: item.title === currentBuildType.title },
          ]"
          @click="toggleBuildPreset(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div class="options">
      <div class="type-name" v-if="!currentBuildType.type">
        <span class="label">配置名称：</span>
        <span class="content">
          <input type="text" v-model="customBuildTitle" placeholder="请输入" />
        </span>
      </div>
      <div class="items-wrap">
        <div class="item">
          <span class="label">单位：</span>
          <span class="content">
            <input type="text" v-model="currentOptions.unit" />
          </span>
        </div>
        <div class="item">
          <span class="label">缩放比例：</span>
          <span class="content">
            <input type="number" v-model="currentOptions.scale" />
          </span>
        </div>
        <div class="item">
          <span class="label">宽度：</span>
          <span class="content">
            <input type="number" v-model="currentOptions.width" />
          </span>
        </div>
        <div class="item">
          <span class="label">容器标签：</span>
          <span class="content">
            <input type="text" v-model="currentOptions.containerTag" />
          </span>
        </div>
        <div class="item">
          <span class="label">图片标签：</span>
          <span class="content">
            <input type="text" v-model="currentOptions.imgTag" />
          </span>
        </div>
        <div class="item">
          <span class="label">类属性名：</span>
          <span class="content">
            <input type="text" v-model="currentOptions.classAttrName" />
          </span>
        </div>
        <div class="item">
          <span class="label">选择器：</span>
          <span class="content">
            <input
              type="text"
              v-model="currentOptions.selector"
              class="small"
            />
          </span>
        </div>
        <div class="item">
          <span class="label">路由配置路径：</span>
          <span class="content">
            <input
              type="text"
              v-model="currentOptions.routerPath"
              class="large"
            />
          </span>
        </div>
        <div class="item">
          <span class="label">路由构建模板：</span>
          <span class="content">
            <div class="btn" @click="onEditRouterTemplate()">编写</div>
          </span>
        </div>
        <div class="item">
          <span class="label">页面路径：</span>
          <span class="content">
            <input
              type="text"
              v-model="currentOptions.pagePath"
              class="large"
            />
          </span>
        </div>
        <div class="item">
          <span class="label">全局组件路径：</span>
          <span class="content">
            <input
              type="text"
              v-model="currentOptions.componentPath"
              class="large"
            />
          </span>
        </div>
        <div class="item">
          <span class="label">图片路径：</span>
          <span class="content">
            <input
              type="text"
              v-model="currentOptions.imgPath"
              class="large"
            />
          </span>
        </div>
      </div>
      <div class="files">
        <div class="title">页面文件：</div>
        <div class="files-wrap">
          <div class="file-item" v-for="(item, index) in currentOptions.files">
            <span class="name" @click="onEditPageFile(index)">{{ item.fileName }}</span>
            <i class="iconfont icon-close-outline" @click="onDeleteFile(index, item)"></i>
          </div>
          <div class="add-file-btn" @click="addPageFileTemplateVisble = true"><i class="iconfont icon-add"></i>添加文件</div>
        </div>
      </div>
      <div class="footer">
        <div>
          <Button @click="deleteOptions()" v-if="currentBuildType.deletable">删除配置</Button>
        </div>
        <div class="flex">
          <Button @click="resetOptions()">重置配置</Button>
          <Button @click="saveOptions()" class="ml-5">保存配置</Button>
        </div>
      </div>
    </div>
    <Modal
      v-model:show="editRouterTemplateVisble"
      title="编辑路由模板"
      @on-confirm="onConfrimRouterTemplte()"
    >
      <RouterTemplate
        :template="currentOptions.routerTemplate"
        ref="editRouterTemplateVue"
      />
    </Modal>

    <Modal
      v-model:show="addPageFileTemplateVisble"
      title="添加页面文件"
      @on-confirm="onAddPageFileTemplte()"
    >
      <PageFileTemplate v-model:template="addPageFileTemplate" v-model:fileName="addPageFileName"/>
    </Modal>

    <Modal
      v-model:show="editPageFileTemplateVisble"
      title="编辑页面文件"
      @on-confirm="onConfrimPageFileTemplte()"
    >
      <PageFileTemplate
        :template="editPageFile.template"
        :fileName="editPageFile.fileName"
        ref="editPageFileTemplteVue"
      />
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Message, Modal } from '@/ly-ui';
import buildOptionsPreset, { customConfigDefault } from "@/constants/build-options-preset";
import RouterTemplate from "./router-template.vue";
import PageFileTemplate from "./page-file-template.vue";
import Validator from "@/lib/validator";
import storage from '@/lib/local-storage';

const localBuildOptionsPreset =
  storage.get("buildOptionsPreset") || {};

const buildTypes = ref([]);
handleTypes();
function handleTypes () {
  buildTypes.value = [
    ...Object.values({
      // 利用对象属性名唯一特性去重
      ...buildOptionsPreset,
      ...localBuildOptionsPreset,
    }).map((item) => ({
      ...item,
      // 如果是系统预设，则不可以被删除
      deletable: !buildOptionsPreset[item.type],
    })),
    customConfigDefault
  ]
}

const rules = {
  unit: { required: true, message: "请输入单位" },
  scale: { required: true, message: "请输入缩放比例" },
  width: { required: true, message: "请输入宽度" },
  containerTag: { required: true, message: "请输入容器标签" },
  imgTag: { required: true, message: "请输入图片标签" },
  classAttrName: { required: true, message: "请输入类属性名" },
  selector: { required: true, message: "请输入选择器" },
  imgPath: { required: true, message: "请输入选择器" },
  routerPath: { required: true, message: "请输入路由配置路径" },
  routerTemplate: { required: true, message: "请编写路由配置方法" },
  pagePath: { required: true, message: "请输入页面路径" },
  componentPath: { required: true, message: "请输入全局组件路径" },
  files: {
    validator(value) {
      if (value.length === 0) {
        throw "请至少添加一个页面文件";
      }
      return true;
    },
  },
}

const validator = new Validator({ rules });

const customBuildTitle = ref("");
const currentBuildType = ref();
const currentOptions = ref({});
// 初始切换至第一个预设
toggleBuildPreset(buildTypes.value[0]);
function toggleBuildPreset(preset) {
  currentBuildType.value = preset;
  currentOptions.value = _.cloneDeep(currentBuildType.value.options);
}
// 重置当前配置的修改
function resetOptions() {
  currentOptions.value = _.cloneDeep(currentBuildType.value.options);
  Message.info("配置已重置");
}

// 保存配置
async function saveOptions() {
  validate().then(() => {
    const { type } = currentBuildType.value;
    if (type) {
      localBuildOptionsPreset[type] = {
        ...currentBuildType.value,
        options: currentOptions.value,
      };
      Message.success("保存配置成功");
    } else {
      if(buildTypes.value.find(item => item.title === customBuildTitle.value)) {
        return Message.warning(`配置：${customBuildTitle.value} 已存在！`);
      }
      // 创建唯一key（type）
      const customType = `custom-${Date.now()}`;
      localBuildOptionsPreset[customType] = {
        type: customType,
        title: customBuildTitle.value,
        options: currentOptions.value,
      };
      Message.success("新增自定义配置成功");

      // 重置自定义配置
      customBuildTitle.value = '';
      currentOptions.value = _.cloneDeep(currentBuildType.value.options);

      // 将新增的配置选中
      toggleBuildPreset(localBuildOptionsPreset[customType]);
    }
    storage.set("buildOptionsPreset", localBuildOptionsPreset);
    handleTypes();
  })
}

// 删除配置
function deleteOptions() {
  const { title, type } = currentBuildType.value;
  Modal.confirm({
    title: '温馨提示',
    content: `确定删除配置：${title} ?`,
    onOk: () => {
      // 删除当前选中的配置
      localBuildOptionsPreset[type] = null;
      delete localBuildOptionsPreset[type];
      // 更新到本地存储
      storage.set("buildOptionsPreset", localBuildOptionsPreset);
      handleTypes(); // 刷新界面
      toggleBuildPreset(buildTypes.value[0]);
      Message.success("删除配置成功");
    }
  })
}

// 路由模板相关
const editRouterTemplateVisble = ref(false);
const editRouterTemplateVue = ref(null);
function onEditRouterTemplate() {
  editRouterTemplateVisble.value = true;
}
function onConfrimRouterTemplte() {
  editRouterTemplateVue.value.getTemplate((template) => {
    currentOptions.value.routerTemplate = template;
    editRouterTemplateVisble.value = false;
  });
}

// 添加页面文件
const addPageFileTemplateVisble = ref(false);
const addPageFileTemplate = ref('');
const addPageFileName = ref('');
function onAddPageFileTemplte() {
  currentOptions.value.files.push({
    fileName: addPageFileName.value,
    template: addPageFileTemplate.value
  })
  addPageFileName.value = '';
  addPageFileTemplate.value = '';
  addPageFileTemplateVisble.value = false;
}

// 编辑页面文件
const editPageFileTemplateVisble = ref(false);
const editPageFileTemplteVue = ref(null);
const editPageFileIdx = ref(null);
const editPageFile = computed(() => {
  const idx = editPageFileIdx.value;
  const { files = [] } = currentOptions.value;
  if(typeof idx === 'number' && files[idx]) {
    return files[idx];
  }
  return {
    template: '',
    fileName: ''
  }
})
function onEditPageFile(index) {
  editPageFileIdx.value = index;
  editPageFileTemplateVisble.value = true;
}
function onConfrimPageFileTemplte() {
  editPageFileTemplteVue.value.getOptions(({ fileName, template }) => {
    const idx = editPageFileIdx.value;
    currentOptions.value.files[idx] = {
      fileName: fileName,
      template: template
    }
    editPageFileTemplateVisble.value = false;
  })
}

// 删除页面文件
function onDeleteFile(index, item) {
  Modal.confirm({
    title: '温馨提示1',
    content: `确认删除页面文件：${item.fileName}?`,
    onOk() {
      currentOptions.value.files.splice(index, 1);
      Message.success(`页面文件：${item.fileName}已删除`);
    }
  })
}

function validate() {
  return validator.validate(currentOptions.value)
    .catch(errs => {
      Message.error(Object.values(errs)[0].message || '校验不通过');
      return Promise.reject(errs);
    })
}

defineExpose({
  currentBuildType,
  currentOptions,
  validate
})
</script>

<style lang="less" scoped>
@import './build-config.less';
</style>
