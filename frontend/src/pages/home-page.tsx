import { PageLayout } from "@/components/page-layout";

export const HomePage: React.FC = () => {
  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <img
          src="/hero.jpg"
          alt="Hero Image"
          className="w-1/2 object-cover"
        />
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <h1 className="text-4xl font-bold">ジェンダーバイアス検出</h1>
          <p className="text-xl">生成AIを用いて会話音声からジェンダーバイアスを検出するアプリケーションです。</p>
          <p className="text-xl">AI Hackathon with Google Cloud への応募のため期間限定で公開中です。</p>
          <p className="text-xl">アプリケーションで扱う各種データはハッカソン期間の終了と合わせて削除いたします。</p>
        </div>
      </div>
    </PageLayout>
  )
}
