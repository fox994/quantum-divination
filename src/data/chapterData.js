export const chapters = [
  {
    id: 1,
    title: "第1章：塌縮前的靜默",
    theme: "觀測與干擾｜心理狀態初測",
    description: "主角為一名離開實驗室、轉而成為擲筊師的女子，在寺廟中遇到一對互不理睬的姐妹。",
    narrative: [
      {
        id: "1-intro",
        text: `雨絲輕柔地穿過廟宇的紅瓦，在天井中繪出一幅霧氣蒙蒙的水墨畫。我撫過桌上的簡陋木筊，指尖傳來一股若有若無的溫度。

是我的體溫，還是前人祈願留下的痕跡？這些木頭，像粒子一樣，或許記得所有曾經發生的可能性。
        
距離離開量子物理實驗室已經整整三年。那些困擾我的公式與理論，如今已化作一種看待世界的方式。如果生命只是粒子的偶然排列，那麼我們的選擇是否真的能改變什麼？`,
      },
      {
        id: "1-encounter",
        text: `廟門外，兩個年輕女子走了進來。姐姐大約二十出頭，眼神堅定而疏離；妹妹稍小些，目光飄忽，手指緊握著姐姐的衣角，卻又像是隨時要放開一般。

她們站在我的攤位前，卻沒有交談，彷彿相隔著一道無形的牆。

「擲筊問個事。」姐姐開口，聲音平靜得近乎冷漠。「我想知道，我們——」她頓了頓，「我跟她之間的緣分，會不會永遠纏在一起？」

我望向她們。在我眼中，人與人之間的關係就像量子糾纏一樣，相互牽引，即使遠隔千里也不會斷裂。但又像自旋一樣，在被觀測的那一刻，必然塌縮為某一種狀態。`,
        question: {
          id: "q1-approach",
          text: "面對這對奇怪的姐妹，你會怎麼做？"
        },
        choices: [
          {
            id: "observe_silent",
            text: "保持沉默，先觀察她們的互動",
            psychImpact: { observer: 2, collapse: -1 }
          },
          {
            id: "direct_question",
            text: "直接問她們：「你們之間發生了什麼？」",
            psychImpact: { collapse: 2, observer: -1 }
          },
          {
            id: "start_ritual",
            text: "不問原因，開始擲筊儀式",
            psychImpact: { entanglement: 1, interference: 1 }
          }
        ]
      },
      {
        id: "1-divination",
        text: `我拿起桌上的木筊，輕輕在手中轉動。這對姐妹身上有種特殊的能量場，像是兩個糾纏的粒子，彼此排斥卻又難以分離。

「筊杯會告訴我們答案，」我說，「但請記住，測量本身就會影響結果。你們的期待，會影響筊杯的傾向。」

妹妹突然開口：「我不想知道答案。」她的聲音輕得幾乎聽不見，「如果知道了，一切就定下來了，不是嗎？」

她的話讓我想起量子疊加態——在被觀測前，粒子可以同時存在於多種狀態。一旦觀測，疊加態塌縮，只剩下一種可能。`,
        question: {
          id: "q1-philosophy",
          text: "關於測量與命運，你如何回應？"
        },
        choices: [
          {
            id: "collapse_truth",
            text: "「觀測讓混沌變得明朗，真相本就在那裡，只是被揭示出來而已。」",
            psychImpact: { collapse: 2, interference: -1 }
          },
          {
            id: "superposition_believe",
            text: "「或許在觀測前，所有可能性都真實存在。正是選擇塑造了現實。」",
            psychImpact: { observer: 1, interference: 1 }
          },
          {
            id: "entanglement_destiny",
            text: "「無論觀測與否，糾纏的命運早已注定，只是我們尚未感知而已。」",
            psychImpact: { entanglement: 2, reflection: -1 }
          }
        ]
      },
      {
        id: "1-ritual-start",
        text: `我將木筊浸入清水，輕輕擦拭，然後遞給姐姐。「想著你的問題，」我說，「讓思緒集中在你與妹妹之間的關係上。」

她接過筊杯，閉上眼睛。在那一刻，我似乎看到了什麼——一道微弱的光，在姐妹之間流動，忽明忽暗。

我從來不相信超自然現象，但作為一名前物理學家，我知道有些事物無法用經典物理解釋。或許人類的情感，就像量子場一樣，以我們尚未完全理解的方式運作。

姐姐擲下筊杯。一陰一陽，煩筊。意義不明。`,
        question: {
          id: "q1-interpretation",
          text: "你會如何解讀這個模糊的結果？"
        },
        choices: [
          {
            id: "scientific_analysis",
            text: "使用準科學的分析，解釋為「關係處於不穩定疊加態」",
            psychImpact: { observer: 1, collapse: 1 }
          },
          {
            id: "intuitive_reading",
            text: "憑直覺解讀：「你們相互影響，卻又試圖分離」",
            psychImpact: { entanglement: 2, reflection: 1 }
          },
          {
            id: "defer_judgment",
            text: "建議再擲一次：「有時答案需要多次測量才能明確」",
            psychImpact: { interference: 2, collapse: -1 }
          }
        ]
      }
    ],
    miniGame: {
      id: "spin_detector",
      title: "自旋測定儀",
      description: "通過連續三次擲筊，感受量子不確定性。每次擲筊前的思想會微妙影響結果，就像觀測會影響量子狀態一樣。",
      type: "divination",
      config: {
        rounds: 3,
        options: ["陽筊", "陰筊", "煩筊", "笑筊"],
        timeLimit: 60
      }
    }
  },
  // Other chapters would be defined here
  {
    id: 2,
    title: "第2章：雙裂縫的影像",
    theme: "疊加與矛盾｜人際與自我認知",
    description: "姐妹分別表達了對彼此的失望與埋怨，兩種說法難以同時為真，卻都無法否定。",
    // ... chapter content would go here
  }
]; 