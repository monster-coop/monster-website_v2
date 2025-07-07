import { NextRequest, NextResponse } from 'next/server'
import { runScheduledNotificationTasks } from '@/lib/database/scheduled-notifications'

/**
 * Scheduled notification tasks endpoint
 * This endpoint should be called by a cron job or scheduled webhook
 * 
 * Example cron job (daily at 9 AM):
 * 0 9 * * * curl -X POST https://your-domain.com/api/notifications/scheduled \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET" \
 *   -H "Content-Type: application/json"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (protect against unauthorized access)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Run scheduled notification tasks
    const results = await runScheduledNotificationTasks()
    
    // Log results for monitoring
    console.log('Scheduled notification tasks results:', JSON.stringify(results, null, 2))
    
    return NextResponse.json({
      success: results.success,
      timestamp: new Date().toISOString(),
      results: results.results
    })
  } catch (error) {
    console.error('Error in scheduled notification tasks:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Health check for scheduled tasks
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Scheduled notification tasks endpoint is ready'
  })
}