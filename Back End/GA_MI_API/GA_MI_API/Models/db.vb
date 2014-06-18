Imports Dapper
Imports System.Data.Common

Public Class needLine
    Public Property dimension_id As Integer
    Public Property ga_year As Integer
    Public Property ga_month As Integer
    Public Property ga_day As Integer
    Public Property ga_hour As Integer
    Public Property real_date As DateTime
    Public Property metric As String
End Class

Public Class recLine
    Public Property year As Integer = -1
    Public Property month As Integer = -1
    Public Property day As Integer = -1
    Public Property hour As Integer = -1
    Public Property pageviews As Integer = -1
    Public Property sessions As Integer = -1
    Public Property users As Integer = -1
    Public Property pagepath As String
End Class


Public Class db

    Shared Function dbConn() As DbConnection
        Dim connection = New SqlClient.SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings("GA_MI").ConnectionString)
        connection.Open()
        Return connection
    End Function

    Public Shared Function getNeedList() As List(Of needLine)
        Dim query As List(Of needLine)
        Using cn As DbConnection = dbConn()
            query = cn.Query(Of needLine)("exec ga_mi.dbo.getNeeded")
        End Using
        Return query
    End Function

    Public Shared Function insertPagePath(values As List(Of recLine)) As String
        For Each line As recLine In values
            Dim metric As String = "ga:pageviews"
            Dim value As Integer = line.pageviews
            Using cn As DbConnection = dbConn()
                cn.Execute("exec ga_mi.dbo.insertPagePath @year, @month, @day, @hour, @pagepath, @metric, @value", New With {line.year, line.month, line.day, line.hour, line.pagepath, metric, value})
            End Using
        Next line
        Return "PagePath"
    End Function


    Public Shared Function insertVolumes(values As List(Of recLine)) As String
        For Each line As recLine In values
            Dim metric As String = ""
            Dim value As Integer = -1
            If line.sessions <> -1 Then
                metric = "ga:sessions"
                value = line.sessions
            End If
            If line.users <> -1 Then
                metric = "ga:users"
                value = line.users
            End If
            Using cn As DbConnection = dbConn()
                cn.Execute("exec ga_mi.dbo.insertValues @year, @month, @day, @hour, @metric, @value", New With {line.year, line.month, line.day, line.hour, metric, value})
            End Using
        Next line
        Return "Other"
    End Function


End Class
