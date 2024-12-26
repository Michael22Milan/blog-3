import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Contact</h1>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-2xl font-medium text-gray-800">Michael Cao</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-xl text-gray-600 break-all">michael22milan@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      
      <Link 
        href="/" 
        className="mt-12 text-lg text-gray-600 hover:text-gray-900 transition-colors flex items-center"
      >
        <span className="mr-2">←</span>
        <span>返回首页</span>
      </Link>
    </div>
  );
} 