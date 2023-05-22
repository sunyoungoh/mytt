<template>
  <div class="editer-container">
    <quill-editor
      class="editor"
      theme="snow"
      ref="myTextEditor"
      :value="value"
      :disabled="false"
      :options="editorOption"
      @change="onEditorChange"
      @ready="onEditorReady($event)"
    />
  </div>
</template>

<script>
import { createImageUrl } from '@/utils/createImageUrl.js';

import hljs from 'highlight.js';
import debounce from 'lodash/debounce';
import { quillEditor } from 'vue-quill-editor';

// highlight.js style
import 'highlight.js/styles/tomorrow.css';

// import theme style
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
  name: 'quill-example-snow',
  title: 'Theme: snow',
  components: {
    quillEditor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editorOption: {
        placeholder: '상세페이지에 들어갈 내용을 입력해주세요.',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // <strong>, <em>, <u>, <s>
            ['blockquote', 'code-block'], // <blockquote>, <pre class="ql-syntax" spellcheck="false">
            [{ header: 1 }, { header: 2 }], // <h1>, <h2>
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // <sub>, <sup>
            [{ indent: '-1' }, { indent: '+1' }], // class제어
            [{ direction: 'rtl' }], //class 제어
            [{ size: ['small', false, 'large', 'huge'] }], //class 제어 - html로 되도록 확인
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, normal
            [{ font: [] }], // 글꼴 class로 제어
            [{ color: [] }, { background: [] }], //style="color: rgb(230, 0, 0);", style="background-color: rgb(230, 0, 0);"
            [{ align: [] }], // class
            // ["clean"],
            ['image'],
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value,
          },
        },
      },
    };
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    },
    contentCode() {
      return hljs.highlightAuto(this.content).value;
    },
  },
  mounted() {
    this.$nextTick(() => {
      var quilEditor = document.getElementsByClassName('ql-editor')[0];
      quilEditor.style.cssText += 'height: 30rem;';
    });
  },
  methods: {
    onEditorChange: debounce(function (value) {
      this.content = value.html;
      this.$emit('input', this.content);
    }, 466),
    onEditorReady(editor) {
      // 이미지 메소드 추가
      editor.getModule('toolbar').addHandler('image', this.imageHandler);
    },
    imageHandler() {
      console.log('imageHandler start=============');

      // 1. 이미지를 저장할 input type=file DOM을 만든다.
      const input = document.createElement('input');
      // 속성 써주기
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
      // input이 클릭되면 파일 선택창이 나타난다.

      // input에 변화가 생긴다면 = 이미지를 선택
      input.addEventListener('change', async () => {
        const file = input.files[0];

        try {
          // 파일 업로드 api 호출
          const imgUrl = await createImageUrl(file);

          // 현재 에디터 커서 위치 조회
          const range = this.editor.getSelection();

          // 커서 위치에 이미지 삽입
          this.editor.insertEmbed(range.index, 'image', imgUrl);
        } catch (error) {
          console.log('error');
        }
      });
    },
  },
};
</script>
