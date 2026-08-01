import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  ExternalLink, 
  ThumbsUp, 
  MessageSquare, 
  Zap, 
  Tag, 
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { MOCK_TRENDS } from '@/mocks/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const TrendDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const trend = MOCK_TRENDS.find(t => t.id === id) || MOCK_TRENDS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Back Bar & Action Buttons */}
      <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-sm text-[#94A3B8] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-[#1F2937] text-xs">
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share Signal
          </Button>
          <Button size="sm" onClick={() => navigate('/alerts')} className="bg-[#6366F1] text-xs text-white">
            <Zap className="mr-1.5 h-3.5 w-3.5" /> Create Alert
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="bg-[#1E293B] text-[#818CF8] border-[#6366F1]/30">
            {trend.category}
          </Badge>
          <Badge variant="success" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +{trend.growthPercentage}% Velocity
          </Badge>
          <span className="text-xs text-[#94A3B8]">Indexed on {trend.createdAt}</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">{trend.title}</h1>
        <p className="text-[#94A3B8] text-base max-w-4xl">{trend.summary}</p>
      </div>

      {/* Grid Layout: Main Left Column & Right Sidebar Cards */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols wide) */}
        <div className="space-y-8 lg:col-span-2">
          {/* AI Summary & Takeaways */}
          <Card className="border-[#6366F1]/40 bg-[#111827] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#10B981]" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#6366F1]" /> AI Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-[#CBD5E1]">
              <p className="leading-relaxed">{trend.detailedAnalysis}</p>
              <div className="rounded-lg bg-[#0F172A] p-4 border border-[#1F2937] space-y-2">
                <p className="font-semibold text-xs text-[#818CF8] uppercase tracking-wider">Key Takeaways</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#94A3B8]">
                  <li>Velocity spike driven by developer adoption on GitHub and Twitter/X threads.</li>
                  <li>Over 76% positive sentiment classification across technical communities.</li>
                  <li>Predicted to maintain exponential momentum for the next 30 days.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Trend Growth Timeline Chart */}
          <Card className="border-[#1F2937] bg-[#111827]">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">30-Day Growth & Sentiment Timeline</CardTitle>
              <CardDescription className="text-xs text-[#94A3B8]">Historical volume progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                    <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#1F2937',
                        borderRadius: '10px',
                        color: '#F8FAFC'
                      }}
                    />
                    <Line type="monotone" dataKey="volume" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Social Feed / Top Posts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#3B82F6]" /> Top Social Mentions & Signal Feed
            </h3>
            <div className="space-y-3">
              {trend.topPosts.map((post) => (
                <Card key={post.id} className="border-[#1F2937] bg-[#111827] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={post.avatar} alt={post.author} />
                        <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white">{post.author}</span>
                          <span className="text-xs text-[#94A3B8]">{post.handle}</span>
                        </div>
                        <span className="text-[11px] text-[#64748B]">{post.platform} • {post.timestamp}</span>
                      </div>
                    </div>
                    <Badge variant={post.sentiment === 'positive' ? 'success' : 'secondary'} className="text-[10px]">
                      {post.sentiment}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-[#CBD5E1]">{post.content}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#94A3B8]">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="h-3.5 w-3.5 text-[#818CF8]" />
                        <span>{post.likes}</span>
                      </span>
                      <span>{post.shares} shares</span>
                    </div>
                    <a href={post.url} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-[#6366F1] hover:underline">
                      <span>View original</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* AI Forecast Card */}
          <Card className="border-[#6366F1]/50 bg-gradient-to-b from-[#111827] to-[#1E1B4B]/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#818CF8]">AI Predictive Forecast</span>
              <Badge variant="default" className="bg-[#10B981]/20 text-[#34D399] border-0 text-[10px]">
                {trend.forecast.momentum} Momentum
              </Badge>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-white">+{trend.forecast.predictedGrowth30d}%</div>
              <p className="text-xs text-[#94A3B8] mt-1">Predicted 30-Day Growth Acceleration</p>
            </div>

            <div className="space-y-2 border-t border-[#1F2937] pt-3 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Model Confidence</span>
                <span className="font-bold text-white">{trend.forecast.confidenceScore}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${trend.forecast.confidenceScore}%` }} />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-[#1F2937] pt-3">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase">Growth Drivers</span>
              <ul className="space-y-1 text-xs text-[#CBD5E1]">
                {trend.forecast.keyDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#6366F1] shrink-0" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Top Keywords */}
          <Card className="border-[#1F2937] bg-[#111827] p-5 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#10B981]" /> Top Associated Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {trend.topKeywords.map((kw) => (
                <span key={kw} className="rounded-lg bg-[#1E293B] px-2.5 py-1 text-xs text-[#94A3B8] border border-[#374151]/50">
                  {kw}
                </span>
              ))}
            </div>
          </Card>

          {/* Related Trends */}
          <Card className="border-[#1F2937] bg-[#111827] p-5 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#3B82F6]" /> Related Clusters
            </h4>
            <div className="space-y-2">
              {trend.relatedTrends.map((rel) => (
                <div 
                  key={rel.id} 
                  onClick={() => navigate(`/trends/${rel.id}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0F172A] border border-[#1F2937] cursor-pointer hover:border-[#6366F1] transition-all"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{rel.title}</p>
                    <span className="text-[10px] text-[#94A3B8]">{rel.category}</span>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#34D399]">
                    <ArrowUpRight className="h-3.5 w-3.5" /> +{rel.growthPercentage}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
