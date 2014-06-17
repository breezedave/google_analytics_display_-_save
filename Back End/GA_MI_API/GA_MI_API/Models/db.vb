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


End Class
